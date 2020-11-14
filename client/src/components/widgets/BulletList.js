import React, { Component } from "react";
import { connect } from "react-redux";
import { getTasks, updateTask, deleteTask, createTask } from '../../actions/taskActions';
import { getGroups } from '../../actions/groupActions';
import { COLORS, progress, priority, bucket, incrementProgress } from '../constants';
import { getDate, yyyymmddToDate, dateToYyyymmdd, dateToHhmm, yyyymmddhhmmToDate, fullDateStringToYyyymmdd, fullDateStringToHourMinPm} from '../../utils/DateUtil';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';

import { AiOutlinePlus, AiOutlineClose, AiOutlineEdit } from "react-icons/ai";
import { BiSortDown, BiSortUp, BiDotsVerticalRounded } from "react-icons/bi";
import { HiFilter, HiOutlineFilter } from 'react-icons/hi';
import TaskModal from "./TaskModal";
import PriorityIcon from "./PriorityIcon";
import ProgressIcon from "./ProgressIcon";

const SORTDIR = {
  ASC: 1,
  DESC: -1
};

const FONT_SIZE = 8;

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
    const { listKey: key } = this.props;
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

/**
 *  Filter is of the form {'and': [{'eq' : {'title': 'test'}}]}
 * @param {Object} item document that you want to filter. e.g. {key1: value1, key2: value2} 
 * @param {Object} filterObj filter object that follows specified EBNF
 * @returns {boolean} 
 */
// 
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

/**
 * A table with resizable columns and reorder on column drag
 * PROPS
 * columns: [{name: "myName", key: "myKey"}] -- consider adding properties to this? "sortable", type="date&time", etc....
 * data: [{objects that have data for AT LEAST all of keys in columns}]
 * renderData: fn(dataRow, key) -> React.Component
 * renderColumn: fn(column) -> React.Component
 * trClassName: className for table row
 * tdClassName: className for table desc
 * thClassName: className for th
 */
class Table extends Component {
  state = {
    widths: {},
    windowWidth: 0,
    columnOrder: []
  }

  tableRef = React.createRef();

  componentDidMount() {
    // description of width is found HERE https://stackoverflow.com/questions/21064101/understanding-offsetwidth-clientwidth-scrollwidth-and-height-respectively
    const totalWidth = this.tableRef.current.clientWidth;
    // const totalWidth = 400;
    let myWidths = {};
    let myColOrder = [];
    for (const column of this.props.columns) {
      myWidths[column.key] = Math.round((1 / (this.props.columns.length)) * totalWidth);
      myColOrder.push(column.key);
    }
    console.log(totalWidth);
    console.log(myWidths);
    console.log(this.tableRef);
    this.setState({ ...this.state, widths: myWidths, windowWidth: totalWidth, columnOrder: myColOrder });
  }

  handleResizeColumn = (e, data, key) => {
    const { widths: w } = this.state;
    const nextKey = this.getNextKey(key);
    this.setState({ ...this.state, widths: { ...w, [key]: w[key] + data.deltaX, [nextKey]: w[nextKey] - data.deltaX } });
  }

  getNextKey = key => {
    const index = this.state.columnOrder.findIndex(item => item === key);
    return this.state.columnOrder[(index + 1) % this.state.columnOrder.length];
  }

  handleReorderCol = (e, data, key) => {
    let colWidth = this.state.columnOrder.map(col => {
      return this.state.widths[col];
    });
    // breakpoints are the mid point of each column
    let colMidpoints = [];
    for (let i = 0; i < colWidth.length; i++) {
      if (i > 0) {
        colMidpoints[i] = colMidpoints[i - 1] + Math.round(0.5 * colWidth[i]) + Math.round(0.5 * colWidth[i - 1]);
      } else {
        colMidpoints[i] = Math.round(0.5 * colWidth[i]);
      }
    }
    let colBreakpoints = [];
    for (let i = 0; i < colWidth.length; i++) {
      if (i > 0) {
        colBreakpoints[i] = colBreakpoints[i - 1] + colWidth[i];
      } else {
        colBreakpoints[i] = colWidth[i];
      }
    }
    let currIndex = this.state.columnOrder.findIndex(item => item === key);
    let stopWidth = colMidpoints[currIndex] + data.x;
    let newIndex = colBreakpoints.findIndex(item => item >= stopWidth);
    if (newIndex !== currIndex) {
      let myColOrder = [...this.state.columnOrder];
      if (newIndex === -1) {
        myColOrder.splice(currIndex, 1);
        myColOrder.push(key);
      } else {
        let temp = myColOrder[currIndex];
        if (currIndex > newIndex) {
          for (let i = currIndex; i >= newIndex; i--) {
            myColOrder[i] = myColOrder[i - 1];
          }
        } else {
          for (let i = currIndex; i <= newIndex; i++) {
            myColOrder[i] = myColOrder[i + 1];
          }
        }
        myColOrder[newIndex] = temp;
      }
      this.setState({ ...this.state, columnOrder: myColOrder });
    }
  }

  renderColItem = (key) => {
    const columnInfo = this.props.columns.find(item => item.key === key);
    const isLastCol = key === this.state.columnOrder[this.state.columnOrder.length - 1];
    return (
      <td
        className={`pr-2 ${!isLastCol ? "border-r" : ""} relative`}
        style={{ width: this.state.widths[key] }}>
        <Draggable
          axis="x"
          handle=".columnReorderHandle"
          grid={[1, 1]}
          scale={1}
          position={{ x: 0, y: 0 }}
          onStop={(e, data) => this.handleReorderCol(e, data, key)}>
          <div
            style={{ cursor: "move" }}
            className="columnReorderHandle w-full h-full"
          >
            {this.props.renderColumn(columnInfo)}
          </div>
        </Draggable>
        {!isLastCol
          ?
          <Draggable
            axis="x"
            handle=".columnResizeHandle"
            grid={[1, 0]}
            scale={1}
            position={{ x: 0, y: 0 }}
            onDrag={(e, data) => this.handleResizeColumn(e, data, key)}>
            <div
              style={{ cursor: "col-resize" }}
              className="h-full w-2 absolute top-0 right-0 z-50 opacity-0 columnResizeHandle">
            </div>
          </Draggable>
          : null
        }
      </td>
    );
  };

  renderCol = () => {
    return (
      <tr>
        {this.state.columnOrder.map((key, i) => {
          return this.renderColItem(key, i);
        })}
      </tr>
    )
  };

  renderRow = row => {
    return (
      <tr>
        {this.state.columnOrder.map((key, i) => {
          return this.renderRowItem(row, key, i);
        })}
      </tr>
    )
  };

  renderRowItem = (row, key, index) => {
    return (
      <td
        className="truncate"
        style={{ width: this.state.widths[key] }}>
        {this.props.renderData(row, key)}
      </td>
    );
  };

  render() {
    const { widths, windowWidth } = this.state;

    return (
      <table
        ref={this.tableRef}
        style={{ width: windowWidth }}
        className="">
        <thead>
          {this.renderCol()}
        </thead>
        <tbody>
          {this.props.data.map(row => this.renderRow(row))}
        </tbody>
      </table>
    );
  }
}

class InputResizer extends Component {
  state = {
    width: {}
  }

  componentDidMount() {
    this.setState({width: this.props.width + this.props.minWidth});
  }

  onChange = e => {
    let diffInChars = e.target.value.length - this.props.value.length;
    if (diffInChars > 0) {
      this.setState({width: this.state.width + diffInChars * FONT_SIZE});
    } else if (diffInChars < 0) {
      this.setState({width: Math.max(this.props.minWidth, this.state.width + diffInChars * FONT_SIZE)});
    }
    this.props.onChange(e);
  }

  render() {
    return (
      <input
        onClick={e => e.stopPropagation()}
        id={this.props.id}
        onChange={this.onChange}
        className={this.props.className}
        value={this.props.value}
        style={{...this.props.style, width: this.state.width}} />
    )
  }
}

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
    this.props.getTasks(this.props.auth.user.id).then(() => {
      let taskValues = this.props.tasks.tasks.map(t => {
        let retVal = {};
        for (const prop in t) {
          if (prop !== "_id") {
            Object.assign(retVal, {[`${t._id}${prop}`]: t[prop]});
          }
        }
        retVal[`${t._id}editVisbile`] = false;
        return retVal;
      });
      let taskValueObj = {};
      taskValues.forEach(t => Object.assign(taskValueObj, t));
      this.setState({...this.state, ...taskValueObj});
    });
    this.props.getGroups(this.props.auth.user.id);
    let myFilter = {};
    for (const h of HEADERS) {
      myFilter[h.key] = {};
    }
    this.setState({ ...this.state, owner: this.props.auth.user.id, filter: myFilter });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tasks !== this.props.tasks) {
      let taskValues = this.props.tasks.tasks.map(t => {
        let retVal = {};
        for (const prop in t) {
          if (prop !== "_id") {
            Object.assign(retVal, {[`${t._id}${prop}`]: t[prop]});
          }
        }
        retVal[`${t._id}editVisbile`] = false;
        return retVal;
      });
      let taskValueObj = {};
      taskValues.forEach(t => Object.assign(taskValueObj, t));
      this.setState({...this.state, ...taskValueObj});
    }
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
      task: undefined,
      widths: {}
    });
  }

  startEdit = (t, e) => {
    this.setState({ ...this.state, editTask: true, task: t })
  };

  updateProgress = (t, e) => {
    e.preventDefault();
    e.stopPropagation();
    const key = `${t._id}progress`;
    this.setState({...this.state, [key]: incrementProgress(this.state[key])});
  }

  closeModal = () => {
    this.setState({ ...this.state, createTask: false, editTask: false });
  }

  inlineTaskOnChange = (e, t) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({...this.state, [`${e.target.id}`]: e.target.value});
  }

  taskRowOnBlur = (e, t) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      // update task logic goes here
      let newTask = {};
      for (const s in this.state) {
        if (s.includes(t._id)) { // i.e. it is a task property
          const key = s.replace(t._id, '');
          newTask[key] = this.state[s];
        }
      }
      newTask['id'] = t._id;
      this.props.updateTask(newTask);
    }
  }

  renderTaskRow = t => {
    const editVisbile = `${t._id}editVisible`;
    return (
      <tr key={t._id}
        tabIndex={0}
        onBlur={e => this.taskRowOnBlur(e, t)}
        className="hover:bg-blue-100 border-b border-blue-300 outline-none"
        onMouseOver={() => this.setState({...this.state, [editVisbile]: true})}
        onMouseOut={() => this.setState({...this.state, [editVisbile]: false})}>
        <td
          className="px-4 py-2">
          <div className="flex flex-row"
            onClick={e => this.updateProgress(t, e)}>
            <ProgressIcon className="hover:opacity-50" id={"progressIcon"} progress={this.state[`${t._id}progress`]} />
            <span className="ml-2 whitespace-no-wrap">{this.state[`${t._id}progress`]}</span>
          </div>
        </td>
        <td className="px-4 py-2 max-w-lg">
          <div className="h-full w-full relative pr-6">
            <InputResizer
              id={`${t._id}title`}
              onChange={e => this.inlineTaskOnChange(e, t)}
              className={`${this.state[editVisbile] ? "bg-blue-100" : ""} whitespace-no-wrap w-auto pl-1`}
              value={this.state[`${t._id}title`]}
              width={FONT_SIZE*t.title.length}
              minWidth={20} />
              <div
              className={`${this.state[editVisbile] ? "opacity-100" : "opacity-0"} h-full w-6 flex items-center justify-center absolute cursor-pointer top-0 right-0`}
              onClick={(e) => { this.startEdit(t, e) }}>
                <AiOutlineEdit className="hover:opacity-75" size={20} color={COLORS.gray500}/>
              </div>
          </div>
        </td>
        <td className="px-4 py-2 whitespace-no-wrap">{t.dueDate ? fullDateStringToYyyymmdd(t.dueDate) + " " + fullDateStringToHourMinPm(t.dueDate) : ""}</td>
        <td className="px-4 py-2">{t.group}</td>
        <td className="px-4 py-2">{t.assigned}</td>
        <td className="px-4 py-2"><PriorityIcon priority={t.priority} /></td>
        <td className="px-4 py-2">{<AiOutlineClose onClick={() => this.deleteTask(t)} className="hover:opacity-50 cursor-pointer" size={20} color={COLORS.gray800} />}</td>
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
        this.setState({ ...this.state, activeFilters: [...activeFilters, key] });
      }
    } else {
      if (activeFilters.includes(key)) {
        let newActiveFilters = [...activeFilters]
        newActiveFilters.splice(newActiveFilters.findIndex((item, index) => { return item === key }), 1);
        this.setState({ ...this.state, activeFilters: newActiveFilters });
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
        className="relative cursor-pointer outline-none flex items-start"
        onClick={e => this.toggleSort(e, sortKey)}
        onBlur={this.headerOnBlur}
        tabIndex={0}>
        <span
          className="pr-12 whitespace-no-wrap ml-4">
          {name}
        </span>
        {isFilterOpen
          ?
          <FilterMenu
            list={this.props.tasks.tasks}
            listKey={sortKey}
            filter={this.state.filter[sortKey]}
            setFilter={filter => this.setState({ ...this.state, filter: { ...this.state.filter, [sortKey]: filter } })}
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

  renderTaskTableHeaderHelper = (name, sortKey) => {
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
          {name.name}
        </span>
        {isFilterOpen
          ?
          <FilterMenu
            list={this.props.tasks.tasks}
            listKey={sortKey}
            filter={this.state.filter[sortKey]}
            setFilter={filter => this.setState({ ...this.state, filter: { ...this.state.filter, [sortKey]: filter } })}
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
          className="mr-4 my-2 bg-transparent hover:bg-gray-700 border-2 border-gray-800 text-gray-800 rounded-lg hover:text-white hover:border-transparent flex place-items-center w-32"
          onClick={() => this.setState({ ...this.state, createTask: true })}>
          <AiOutlinePlus size={22} className="ml-1" />
          <span className="mx-2">Create Task</span>
        </button>
        <table className="my-2 table-auto">
          {this.renderTaskHeader()}
          {tasksLoading
            ?
            <tbody><tr><td>loading...</td></tr></tbody>
            :
            <tbody>{taskList}</tbody>
          }
          <tfoot>
            <tr className="hover:bg-blue-100 border-b border-blue-300 outline-none h-10">
              <td colSpan={100}>
                <div className="relative cursor-pointer"
                onClick={e => this._createTask(e)}>
                  <div className="absolute top-0 left-0 w-6 h-full justify-items-center items-center">
                    <AiOutlinePlus size={20} />
                  </div>
                  <span className="pl-6">Click to quick add task</span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }

  _createTask = e => {
    let date = getDate();
    let task = { 
        title: "New Task",
        owner: this.props.auth.user.id,
        startDate: date, 
        priority: priority.MEDIUM,
        progress: progress.NONE,
        bucket: bucket.NONE };
    task = this._convertTaskDate(task);
    this.props.createTask(task);
  };

  // converts yyyy-mm-dd and hh:mm to Date object
  _convertTaskDate = task => {
    task.startDate = task.startDate ? yyyymmddhhmmToDate(task.startDate, task.startTime) : undefined;
    task.dueDate = task.dueDate ? yyyymmddhhmmToDate(task.dueDate, task.dueTime) : undefined;
    return task;
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  tasks: state.tasks,
  groups: state.groups
});

export default connect(
  mapStateToProps,
  { createTask, getTasks, updateTask, deleteTask, getGroups }
)(BulletList);