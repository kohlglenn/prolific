import React, { Component } from "react";
import { connect } from "react-redux";
import {getTasks, updateTask, deleteTask} from '../../actions/taskActions';
import { COLORS } from '../constants';
import { fullDateStringToYyyymmdd, fullDateStringToHourMinPm } from '../../utils/DateUtil';
import { truncate } from '../../utils/StringUtil';

import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { FaEraser, FaThList } from "react-icons/fa";
import OpacityButton from "../button/OpacityButton";
import TaskModal from "./TaskModal";
import PriorityIcon from "./PriorityIcon";
import ProgressIcon from "./ProgressIcon";
import Combobox from './Combobox';

class BulletList extends Component {
    state = {
        createTask: false,
        editTask: false, 
        owner: "",
        task: undefined,
        testVal: ""
    };

    componentDidMount() {
        this.props.getTasks(this.props.auth.user.id);
        this.setState({...this.state, owner: this.props.auth.user.id});
    }

    onChange = e => {
        this.setState({...this.state, [e.target.id]: e.target.value});
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
  
  

  startEdit = (t,e) => {
    console.log(e.target);
    console.log(e.target.id);
    if (e.target.id === "progressIcon") {
      // UPDATE TASK TO INCREMENT PROGRESS. Can also use this framework for assignee etc maybe? Create a popup based on click location
    }
    this.setState({...this.state, editTask: true, task: t})
  };

  closeModal = () => {
    this.setState({...this.state, createTask: false, editTask: false});
  }

  renderTaskRow = t => {
    return (
      <tr key={t._id} 
      className="bg-gray-100 hover:bg-blue-100 cursor-pointer"
      onClick={(e)=>{this.startEdit(t,e)}}>
        <td
        className="border px-4 py-2">
          <div className="flex flex-row">
            <ProgressIcon className="hover:opacity-50" id={"progressIcon"} progress={t.progress} />
            <span className="ml-2">{t.progress}</span>
          </div>
        </td>
        <td className="border px-4 py-2 max-w-lg">
          <div className="flex flex-row justify-between">
            <span className="whitespace-no-wrap">{truncate(t.title, 50)}</span>
            {/* <BiEdit onClick={()=>this.startEdit(t)} className="hover:opacity-50 cursor-pointer" size={20} color={COLORS.gray800} />  */}
          </div>
        </td>
        {/* <td className="border px-4 py-2">{<BiEdit onClick={()=>this.startEdit(t)} className="hover:opacity-50 cursor-pointer" size={20} color={COLORS.gray800} /> }</td> */}
        <td className="border px-4 py-2 whitespace-no-wrap">{t.dueDate ? fullDateStringToYyyymmdd(t.dueDate) + " " + fullDateStringToHourMinPm(t.dueDate) : ""}</td>
        <td className="border px-4 py-2">{t.group}</td>
        <td className="border px-4 py-2">{t.assigned}</td>
        <td className="border px-4 py-2"><PriorityIcon priority={t.priority} /></td>
        <td className="border px-4 py-2">{<AiOutlineClose onClick={()=>this.deleteTask(t)} className="hover:opacity-50 cursor-pointer" size={20} color={COLORS.gray800} /> }</td>
      </tr>
    );
  }

  renderTaskHeader = () => {
    return (
      <thead>
        <tr>
          <th>Progress</th>
          <th>
            Title
          </th>
          <th>Due Date</th>
          <th>Group</th>
          <th>Assigned</th>
          <th>Priority</th>
          <th>Delete</th>
        </tr>
      </thead>
    );
  }

render() {
    const { tasks, tasksLoading } = this.props.tasks;
    const { editTask, createTask } = this.state;
    let taskList = tasks 
    ? tasks.map((t, i) => {
        return (
          this.renderTaskRow(t)
        );
    })
    : [];


return (
      <div className=" flex flex-col">
        {createTask
        ?
        <TaskModal create={true} state={this.state} closeModal={this.closeModal}/>
        :
        null}
        {editTask
        ?
        <TaskModal edit state={this.state} closeModal={this.closeModal}/>
        :
        null}
        <button 
        className="mr-4 mb-2 bg-transparent hover:bg-gray-700 border-2 border-gray-800 text-gray-800 rounded-lg hover:text-white hover:border-transparent flex place-items-center w-32"
        onClick={() => this.setState({...this.state, createTask: true})}>
          < AiOutlinePlus size={22} className="ml-1"/>
          <span className="mx-2">Create Task</span>
        </button>
        <table className="m-2 table-auto">
          {this.renderTaskHeader()}
          {tasksLoading 
          ? <tbody><tr><td>loading...</td></tr></tbody> 
          : <tbody>{taskList}</tbody>}
        </table>
        <Combobox values={["Uno", "dos", "tres"]} value={this.state.testVal} onChange={this.onChange} id="testVal" />
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