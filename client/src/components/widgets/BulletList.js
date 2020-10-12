import React, { Component } from "react";
import { connect } from "react-redux";
import { getTasks, updateTask, deleteTask } from '../../actions/taskActions';
import { COLORS } from '../constants';
import { fullDateStringToYyyymmdd, fullDateStringToHourMinPm } from '../../utils/DateUtil';
import { truncate } from '../../utils/StringUtil';
import PropTypes from 'prop-types';

import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { BiSortDown, BiSortUp } from "react-icons/bi";
import { HiFilter, HiOutlineFilter } from 'react-icons/hi';
import TaskModal from "./TaskModal";
import PriorityIcon from "./PriorityIcon";
import ProgressIcon from "./ProgressIcon";

const SORTDIR = {
  ASC: 1,
  DESC: -1
};

/**
 * TODO
 * --Unhighlight filter if no filters from column are selected
 * --Show filters on clicking menu and have check marks show up 
 * (this involved coming up with a structure in state to keep track of arbitrary values)
 * --ability to add different kinds of filters (ranges, etc) and state handling of these filters
 * --factor out filter logic. Consider having all filter menu logic be self-contained in a component and filter logic in a queryutil class
 * (will I be able to extract the state I need to if I do this?)
 * --on select all, highlight/unhighlight all choices in filter menu
 * --remove console.log statements
 * --remove null and undefined from filter lists and have all select them by default
 */

/**
 * @param list table of values you want to extract unique values from
 * @param listKey list key you want to use to filter values
 * @param setFilter function to set filter
 * @param setActive funtion to set active flag on unmounting
 * @param filter return value: data structure that is updated on filter in form {and: [{'filter': {'key': 'value'}}]}
 */
class FilterMenu extends Component {
  state = {
    list: [],
    isChecked: {}
  };

  componentDidMount() {
    // list: list of unique values
    // filteredList: processes list with this.props.filter to see which options have been selected
    const { listKey: key } = this.props;
    let list = this.props.list.map((v, i) => {
      return v[key];
    });
    let filteredList = list.filter((v, i) => {
      return filterProcessor({ [key]: v }, this.props.filter);
    });
    list = list.filter((v, i) => {
      return v && i === list.findIndex((item) => item === v);
    });
    let isChecked = {};
    for (const value of list) {
      isChecked[value] = false;
    }
    for (const value of filteredList) {
      isChecked[value] = true;
    }
    let all = true;
    for (const value of Object.values(isChecked)) {
      all = all && value;
    }
    isChecked.all = all;
    this.setState({ ...this.state, list: list, isChecked: isChecked });
  };

  componentWillUnmount() {
    const {listKey: key} = this.props;
    let filteredList = this.state.list.filter((v, i) => {
      return filterProcessor({ [key]: v }, this.props.filter);
    });
    this.props.setActive(filteredList.length !== this.state.list.length);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tasks !== this.props.tasks) {
      let list = this.props.list.map((v, i) => {
        return v[this.props.listKey];
      });
      list = list.filter((v, i) => {
        return v && i === list.findIndex((item) => item === v);
      });
      let isChecked = { ...this.state.isChecked };
      for (const value of list) {
        if (!(value in isChecked)) {
          isChecked[value] = true;
        }
      }
      let all = true;
      for (const value of Object.values(isChecked)) {
        all = all && value;
      }
      isChecked.all = all;
      this.setState({ ...this.state, list: list, isChecked: isChecked });
    }
  }

  generateFilter = isChecked => {
    // if all is checked, then do not filter anything
    if (isChecked.all === true) {
      return { and: [] };
    }
    // generates a filter that EXCLUDES those NOT checked
    let filterObj = { or: [] };
    for (const [key, value] of Object.entries(isChecked)) {
      if (!value) {
        filterObj.or.push({ eq: { [this.props.listKey]: key } });
      }
    }

    return { not: filterObj };
  }

  onChange = (e, item) => {
    e.stopPropagation();
    e.preventDefault();
    let allValue = this.state.isChecked.all;
    let isChecked = { ...this.state.isChecked };
    if (item === 'all') {
      for (const [key, value] of Object.entries(isChecked)) {
        isChecked[key] = !allValue;
      }
    } else {
      const currValue = this.state.isChecked[item];
      isChecked[item] = !currValue;
      allValue = true;
      for (const [key, value] of Object.entries(isChecked)) {
        if (key !== 'all') {
          allValue = allValue && value;
        }
      }
      isChecked.all = allValue;
    }
    let filter = this.generateFilter(isChecked);
    this.props.setFilter(filter);
    this.setState({ ...this.state, isChecked: isChecked });
  }

  renderListItem = item => {
    const autoFocus = false;

    return (
      <div
        autoFocus={autoFocus}
        tabIndex={0}
        className="relative outline-none"
        key={item}
        id={item}
        onClick={e => this.onChange(e, item)}>
        <div
          className="absolute top-0 left-0 w-4">
          <span>{this.state.isChecked[item] ? "x" : "o"}</span>
        </div>
        <label
          className="pl-4">
          {item}
        </label>
      </div>
    );
  };

  render() {
    let itemList = [...this.state.list];
    itemList.unshift('all');
    itemList = itemList.map(item => this.renderListItem(item));
    return (
      <div
        className="absolute top-6 right-0 bg-white z-20">
        {itemList}
      </div>
    );
  }
}

FilterMenu.propTypes = {
  listKey: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
  filter: PropTypes.object.isRequired,
  setFilter: PropTypes.func.isRequired,
  setActive: PropTypes.func.isRequired
};

const FILTERTYPES = ['and', 'or', 'not', 'eq', 'gt', 'lt', 'in'];

// Filter is of the form {'and': [{'eq' : {'title': 'test'}}]}
const filterProcessor = (item, filterObj) => {
  // e.g. {'eq': {'title': 'my title'}}
  const key = Object.keys(filterObj)[0]; // e.g. 'eq' should only be one key total
  if (!key) return true; // empty objects are true by default
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
      console.error(`Invalid filter ${JSON.stringify(filterObj)}`);
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
    filter: {},
    activeFilter: "",
    activeFilters: []
  };

  componentDidMount() {
    this.props.getTasks(this.props.auth.user.id);
    let myFilter = {};
    for (const h of HEADERS) {
      myFilter[h.key] = {};
    }
    this.setState({ ...this.state, owner: this.props.auth.user.id, filter: myFilter });
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

  renderTaskHeader = () => {
    let headers = HEADERS.map((h, i) => {
      return (
        <th key={h.name}>
          {this.renderTaskHeaderHelper(h.name, h.key)}
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

  // Controls the filter menu
  toggleFilterMenu = (e, key) => {
    e.preventDefault();
    e.stopPropagation();
    const { activeFilter } = this.state;
    if (activeFilter !== key) {
      this.setState({ ...this.state, activeFilter: key });
    } else {
      this.setState({ ...this.state, activeFilter: "" });
    }
  };

  handleActiveFilters = (bool, key) => {
    const { activeFilters } = this.state;
    if (bool) {
      if (!activeFilters.includes(key)) {
        this.setState({...this.state, activeFilters: [...activeFilters, key]});
      }
    } else {
      if (activeFilters.includes(key)) {
        let newActiveFilters = [...activeFilters]
        newActiveFilters.splice(newActiveFilters.findIndex((item, index) => {return item === key}), 1);
        this.setState({...this.state, activeFilters: newActiveFilters});
      }
    }
  };

  headerOnBlur = e => {
    // by default, onBlur is fired before the object gaining focus receives it (making it impossible to click on the dropdown)
    // needed to make the the dropdown focusable (by adding tabindex=0) and check to see if the object gaining focus was a child
    // of the object losing focus. currentTarget is the object losing focus, relatedTarget is the object gaining it.
    if (!e.currentTarget.contains(e.relatedTarget)) {
        this.setState({ ...this.state, activeFilter: "" });
    }
}

  renderTaskHeaderHelper = (name, sortKey) => {
    const isSorted = sortKey === this.state.sortedOn;
    const isActive = this.state.activeFilters.includes(sortKey);
    const isFilterOpen = this.state.activeFilter === sortKey;
    const { sortDir } = this.state;

    return (
      <div
        className="relative cursor-pointer outline-none"
        onClick={e => this.toggleSort(e, sortKey)}
        onBlur={this.headerOnBlur}
        tabIndex={0}>
        <span
          className="pr-12 whitespace-no-wrap">
          {name}
        </span>
        {isFilterOpen
          ?
          <FilterMenu 
          list={this.props.tasks.tasks} 
          listKey={sortKey} 
          filter={this.state.filter[sortKey]} 
          setFilter={filter => this.setState({ ...this.state, filter: {...this.state.filter, [sortKey]: filter} })} 
          setActive={bool => this.handleActiveFilters(bool, sortKey)}
          />
          :
          null
        }
        <div
          className="absolute top-0 right-0 w-6 mt-1 hover:opacity-50 cursor-pointer"
          onClick={e => this.toggleFilterMenu(e, sortKey)}
        >
          {isActive
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

  getFilter = () => {
    let filter = { and: [] };
    for (const [key, value] of Object.entries(this.state.filter)) {
      filter.and.push(value);
    }
    return filter;
  }

  render() {
    const { tasks, tasksLoading } = this.props.tasks;
    const { editTask, createTask, sortedOn, sortDir, filter } = this.state;
    const sortHelper = (a, b) => {
      return sortDir * (a[sortedOn] > b[sortedOn] ? 1 : (a[sortedOn] < b[sortedOn] ? -1 : 0));
    }

    let taskList = [...tasks];
    taskList = taskList.filter(task => {
      return filterProcessor(task, this.getFilter());
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
          {this.renderTaskHeader()}
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