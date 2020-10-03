import React, { Component } from "react";
import { connect } from "react-redux";
import {getTasks, updateTask, deleteTask} from '../../actions/taskActions';

import { AiOutlinePlus } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { FaEraser, FaThList } from "react-icons/fa";
import OpacityButton from "../button/OpacityButton";
import TaskModal from "./TaskModal";
import PriorityIcon from "./PriorityIcon";
import ProgressIcon from "./ProgressIcon";

class BulletList extends Component {
    state = {
        createTask: false,
        editMode: "",
        eTitle: "",
        eGroup: "",
        eOwner: "",
        eAssigned: "",
        eBucket: "",
        eProgress: "",
        ePriority: "",
        eStartDate: "",
        eDueDate: "",
        eNotes: "",
        eSubtasks: []
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
    
    editTask = t => {
      // TODO
    }

    resetState = () => {
        this.setState({
          editMode: "",
          eTitle: "",
          eGroup: "",
          eOwner: "",
          eAssigned: "",
          eBucket: "",
          eProgress: "",
          ePriority: "",
          eStartDate: "",
          eDueDate: "",
          eNotes: "",
          eSubtasks: []
        });
    }
  
  

  startEdit = t => {
    this.setState({...this.state, editMode: t._id, eTitle: t.title})
  };

  closeModal = () => {
    this.setState({...this.state, createTask: false});
  }

  renderTaskRow = t => {
    // TODO: finish me
    return (
      <tr key={t._id}>
        <td>{t.title}</td>
        <td>{t.group}</td>
        <td>{t.owner}</td>
        <td>{t.assigned}</td>
        <td>{t.bucket}</td>
        <td><ProgressIcon progress={t.progress} /></td>
        <td><PriorityIcon priority={t.priority} /></td>
        <td>{t.startDate}</td>
        <td>{t.dueDate}</td>
      </tr>
    );
  }

  renderTaskHeader = () => {
    return (
      <thead>
        <tr>
          <th>Title</th>
          <th>Group</th>
          <th>Owner</th>
          <th>Assigned</th>
          <th>Bucket</th>
          <th>Progress</th>
          <th>Priority</th>
          <th>Start Date</th>
          <th>Due Date</th>
        </tr>
      </thead>
    );
  }

render() {
    const { tasks, tasksLoading } = this.props.tasks;
    const { editMode, createTask } = this.state;
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

// TaskForm.propTypes = {
//   logoutUser: PropTypes.func.isRequired,
//   auth: PropTypes.object.isRequired
// };

const mapStateToProps = state => ({
  auth: state.auth,
  tasks: state.tasks
});

export default connect(
  mapStateToProps,
  { getTasks, updateTask, deleteTask }
)(BulletList);