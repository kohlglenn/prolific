import React, { Component } from "react";
import { connect } from "react-redux";
import {getTasks, updateTask, deleteTask} from '../../actions/taskActions';
import { COLORS } from '../constants';

import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { FaEraser, FaThList } from "react-icons/fa";
import OpacityButton from "../button/OpacityButton";
import TaskModal from "./TaskModal";
import PriorityIcon from "./PriorityIcon";
import ProgressIcon from "./ProgressIcon";

class BulletList extends Component {
    state = {
        createTask: false,
        editTask: false, 
        owner: "",
        task: undefined
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
  
  

  startEdit = t => {
    this.setState({...this.state, editTask: true, task: t})
  };

  closeModal = () => {
    this.setState({...this.state, createTask: false, editTask: false});
  }

  renderTaskRow = t => {
    return (
      <tr key={t._id}>
        <td><ProgressIcon progress={t.progress} /></td>
        <td>{t.title}</td>
        <td>{t.group}</td>
        {/* <td>{t.owner}</td> */}
        <td>{t.assigned}</td>
        <td>{t.bucket}</td>
        <td><PriorityIcon priority={t.priority} /></td>
        {/* <td>{t.startDate}</td> */}
        <td>{t.dueDate}</td>
        <td>{<BiEdit onClick={()=>this.startEdit(t)} className="hover:opacity-50 cursor-pointer" size={20} color={COLORS.gray800} /> }</td>
        <td>{<AiOutlineClose onClick={()=>this.deleteTask(t)} className="hover:opacity-50 cursor-pointer" size={20} color={COLORS.gray800} /> }</td>
      </tr>
    );
  }

  renderTaskHeader = () => {
    return (
      <thead>
        <tr>
          <th>Progress</th>
          <th>Title</th>
          <th>Group</th>
          {/* <th>Owner</th> */}
          <th>Assigned</th>
          <th>Bucket</th>
          <th>Priority</th>
          {/* <th>Start Date</th> */}
          <th>Due Date</th>
          <th>Edit</th>
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
        <table className="m-2">
          {this.renderTaskHeader()}
          {tasksLoading 
          ? <tr><td>loading...</td></tr> 
          : <tbody>{taskList}</tbody>}
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