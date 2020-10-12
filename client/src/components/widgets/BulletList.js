import React, { Component } from "react";
import { connect } from "react-redux";
import { getTasks, updateTask, deleteTask } from '../../actions/taskActions';
import { COLORS } from '../constants';
import { fullDateStringToYyyymmdd, fullDateStringToHourMinPm } from '../../utils/DateUtil';
import { truncate } from '../../utils/StringUtil';

import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { BiSortDown, BiSortUp } from "react-icons/bi";
import { HiFilter, HiOutlineFilter } from 'react-icons/hi';
import TaskModal from "./TaskModal";
import PriorityIcon from "./PriorityIcon";
import ProgressIcon from "./ProgressIcon";
import { FaTintSlash } from "react-icons/fa";

const SORTDIR = {
  ASC: 1,
  DESC: -1
};

const FILTERTYPES = ['and', 'or', 'not', 'eq', 'gt', 'lt', 'in'];

// Filter is of the form {'and': [{'eq' : {'title': 'test'}}]}
const filterProcessor = (item, filterObj) => {
  // e.g. {'eq': {'title': 'my title'}}
  const key = Object.keys(filterObj)[0]; // e.g. 'eq' should only be one key total
  let filter, filterKey, filterValue;
  filter = filterObj[key]; // e.g. {'title' : 'my title'}
  if (key !== 'and' && key !== 'or') {
    filterKey = Object.keys(filter)[0]; // e.g. 'title' can be multiple in 'and' and 'or'
    filterValue = filter[filterKey]; // e.g. 'my title'
  }

  switch (key) {
    case 'and':
      for (const f of filter) {
        if (!filterProcessor(item, f)) return false;
      }
      return true;
    case 'or':
      for (const f of filter) {
        if (filterProcessor(item, f)) return true;
      }
      return false;
    case 'not':
      return !filterProcessor(item, filter);
    case 'eq':
      return item[filterKey] === filterValue;
    case 'gt':
      return item[filterKey] > filterValue;
    case 'lt':
      return item[filterKey] < filterValue;
    case 'in':
      return item[filterKey].includes(filterValue);
    default:
      console.error(`Invalid filter ${filterObj}`);
      return true;
  }
}

// List of the table headers and key to sort tasks on (from TaskSchema)
const HEADERS = [
  { name: "Progress", key: "progress" },
  { name: "Title", key: "title" },
  { name: "Due Date", key: "dueDate" },
  { name: "Group", key: "group" },
  { name: "Assigned", key: "assigned" },
  { name: "Priority", key: "priority" }
];

class BulletList extends Component {
  state = {
    createTask: false,
    editTask: false,
    owner: "",
    task: undefined,
    testVal: "",
    sortedOn: "_id",
    sortDir: SORTDIR.ASC,
    filterOn: [],
    filter: { and: [] },
    activeFilter: ""
    };

  componentDidMount() {
    this.props.getTasks(this.props.auth.user.id);
    this.setState({ ...this.state, owner: this.props.auth.user.id });
  }

  onChange = e => {
    this.setState({ ...this.state, [e.target.id]: e.target.value });
  };

  deleteTask = t => {
    this.props.deleteTask(t._id);
  };

  resetState = () => {
    this.setState({
      ...this.state,
      createTask: false,
      editTask: false,
      task: undefined
    });
  }

  startEdit = (t, e) => {
    console.log(e.target);
    console.log(e.target.id);
    if (e.target.id === "progressIcon") {
      // UPDATE TASK TO INCREMENT PROGRESS. Can also use this framework for assignee etc maybe? Create a popup based on click location
    }
    this.setState({ ...this.state, editTask: true, task: t })
  };

  closeModal = () => {
    this.setState({ ...this.state, createTask: false, editTask: false });
  }

  renderTaskRow = t => {
    return (
      <tr key={t._id}
        className="bg-gray-100 hover:bg-blue-100 cursor-pointer"
        onClick={(e) => { this.startEdit(t, e) }}>
        <td
          className="border px-4 py-2">
          <div className="flex flex-row">
            <ProgressIcon className="hover:opacity-50" id={"progressIcon"} progress={t.progress} />
            <span className="ml-2 whitespace-no-wrap">{t.progress}</span>
          </div>
        </td>
        <td className="border px-4 py-2 max-w-lg">
          <div className="flex flex-row justify-between">
            <span className="whitespace-no-wrap">{truncate(t.title, 50)}</span>
          </div>
        </td>
        <td className="border px-4 py-2 whitespace-no-wrap">{t.dueDate ? fullDateStringToYyyymmdd(t.dueDate) + " " + fullDateStringToHourMinPm(t.dueDate) : ""}</td>
        <td className="border px-4 py-2">{t.group}</td>
        <td className="border px-4 py-2">{t.assigned}</td>
        <td className="border px-4 py-2"><PriorityIcon priority={t.priority} /></td>
        <td className="border px-4 py-2">{<AiOutlineClose onClick={() => this.deleteTask(t)} className="hover:opacity-50 cursor-pointer" size={20} color={COLORS.gray800} />}</td>
      </tr>
    );
  }

  renderTaskHeader = (uniqueValues) => {
    let headers = HEADERS.map((h, i) => {
      return (
        <th key={h.name}>
          {this.renderTaskHeaderHelper(h.name, h.key, uniqueValues)}
        </th>
      );
    });

    return (
      <thead>
        <tr>
          {headers}
        </tr>
      </thead>
    );
  }

  toggleSort = (e, sortKey) => {
    e.preventDefault();
    console.log('second');
    if (this.state.sortedOn === sortKey) {
      // flip sort dir or remove sort from row
      if (this.state.sortDir === SORTDIR.ASC) {
        this.setState({ ...this.state, sortDir: SORTDIR.DESC });
      } else {
        this.setState({ ...this.state, sortDir: SORTDIR.ASC, sortedOn: "_id" });
      }
    } else {
      // sort in ascending order on sortKey
      this.setState({ ...this.state, sortedOn: sortKey, sortDir: SORTDIR.ASC })
    }
  }

  handleFilter = (e, key) => {
    e.preventDefault();
    e.stopPropagation();
    const { filterOn, activeFilter } = this.state;

    if (!filterOn.includes(key) && activeFilter !== key) {
      this.setState({ ...this.state, filterOn: [...this.state.filterOn, key], activeFilter: key });
    } else if (!filterOn.includes(key) && activeFilter === key) {
      this.setState({ ...this.state, filterOn: [...this.state.filterOn, key], activeFilter: "" });
    } else if (activeFilter !== key) {
      this.setState({...this.state, activeFilter: key});
    } else {
      this.setState({...this.state, activeFilter: ""});
    }
  };

  filterOnBlur = e => {
    // by default, onBlur is fired before the object gaining focus receives it (making it impossible to click on the dropdown)
    // needed to make the the dropdown focusable (by adding tabindex=0) and check to see if the object gaining focus was a child
    // of the object losing focus. currentTarget is the object losing focus, relatedTarget is the object gaining it.
    if (!e.currentTarget.contains(e.relatedTarget)) {
        this.setState({ ...this.state, activeFilter: "" });
    }
}

  filterOnChange = (e, key) => {
    e.stopPropagation();
    e.preventDefault();
    const newFilter = {eq: {[key]: e.target.id}};
    let filters = [...this.state.filter.and];
    const index = filters.findIndex(v => {
      return JSON.stringify(v) === JSON.stringify(newFilter);
    });
    if (index === -1) {
      filters.push(newFilter);
    } else {
      filters.splice(index,1);
    }
    this.setState({...this.state, filter: { and: filters}});
    console.log(filters);
  }

  renderFilterMenu = (values, key) => {
    let filterValues = [...values];
    filterValues.unshift('(all)');
    filterValues = filterValues.map(v => {
      const autoFocus = v === '(all)';
      return (
        <div
        autoFocus={autoFocus}
        tabIndex={0}
        className="relative outline-none"
        id={v}
        onClick={e => this.filterOnChange(e, key)}
        key={v}>
          <input 
          id={v}
          className="absolute top-0 left-0 w-4"
          type="checkbox"
          value={v}/>
          <label
          className="pl-4">
            {v}
          </label>
        </div>
      );
    });

    return (
      <div
      className="absolute top-8 right-0 bg-white z-10"
      onBlur={this.filterOnBlur}>
        {filterValues}
      </div>
    );
  }

  renderTaskHeaderHelper = (name, sortKey, uniqueValues) => {
    const isSorted = sortKey === this.state.sortedOn;
    const isFiltered = this.state.filterOn.includes(sortKey);
    const isActiveFilter = this.state.activeFilter === sortKey;
    const { sortDir } = this.state;
    const values = uniqueValues[sortKey];

    return (
      <div
        className="relative cursor-pointer"
        onClick={e => this.toggleSort(e, sortKey)}>
        <span
          className="pr-12 whitespace-no-wrap">
          {name}
        </span>
        {isActiveFilter
            ?
            this.renderFilterMenu(values, sortKey)
            :
            null
          }
        <div
          className="absolute top-0 right-0 w-6 mt-1 hover:opacity-50 cursor-pointer"
          onClick={e => this.handleFilter(e, sortKey)}>
          {isFiltered
            ?
            <HiFilter size={16} />
            :
            <HiOutlineFilter size={16} />
          }
        </div>
        {isSorted
          ?
          <div
            className="absolute top-0 right-6 w-6 mt-1">
            {sortDir === SORTDIR.ASC
              ? <BiSortDown size={20} />
              : <BiSortUp size={20} />}
          </div>
          : null}
      </div>
    );
  }

  render() {
    const { tasks, tasksLoading } = this.props.tasks;
    const { editTask, createTask, sortedOn, sortDir, filter } = this.state;
    const sortHelper = (a, b) => {
      return sortDir * (a[sortedOn] > b[sortedOn] ? 1 : (a[sortedOn] < b[sortedOn] ? -1 : 0));
    }

    let taskList = [...tasks];
    let uniqueValues = {};
    taskList = taskList.filter(task => {
      for (const h of HEADERS) {
        if (h.key in uniqueValues) {
          uniqueValues[h.key].add(task[h.key])
        } else {
          uniqueValues[h.key] = new Set([task[h.key]]);
        }
      }
      return filterProcessor(task, filter);
    });
    taskList.sort(sortHelper);
    taskList = taskList.map((t, i) => {
      return (
        this.renderTaskRow(t)
      );
    });

    return (
      <div className="flex flex-col">
        {createTask
          ?
          <TaskModal create={true} state={this.state} closeModal={this.closeModal} />
          :
          null}
        {editTask
          ?
          <TaskModal edit state={this.state} closeModal={this.closeModal} />
          :
          null}
        <button
          className="mr-4 mb-2 bg-transparent hover:bg-gray-700 border-2 border-gray-800 text-gray-800 rounded-lg hover:text-white hover:border-transparent flex place-items-center w-32"
          onClick={() => this.setState({ ...this.state, createTask: true })}>
          <AiOutlinePlus size={22} className="ml-1" />
          <span className="mx-2">Create Task</span>
        </button>
        <table className="m-2 table-auto">
          {this.renderTaskHeader(uniqueValues)}
          {tasksLoading
            ?
            <tbody><tr><td>loading...</td></tr></tbody>
            :
            <tbody>{taskList}</tbody>
          }
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  tasks: state.tasks
});

export default connect(
  mapStateToProps,
  { getTasks, updateTask, deleteTask }
)(BulletList);