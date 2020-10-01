import React, { Component } from "react";
import { connect } from "react-redux";
import {getTasks, updateTask, deleteTask} from '../../actions/taskActions';

import { AiOutlinePlus } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { FaEraser } from "react-icons/fa";
import OpacityButton from "../button/OpacityButton";
import CreateTaskModal from "./CreateTaskModal";

class BulletList extends Component {
    state = {
        createTask: true,
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
        this.setState({owner: this.props.auth.user.id});
    }

    onChange = e => {
        this.setState({[e.target.id]: e.target.value});
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

render() {
    const { tasks, tasksLoading } = this.props.tasks;
    const { editMode, createTask } = this.state;
    let taskList = tasks 
    ? tasks.map((t, i) => {
        return (
            <li key={i}>
              {editMode && editMode === t._id 
              ? 
              <div>
                <input 
                  required 
                  onChange={this.onChange} 
                  value={this.state.eTitle}
                  id="eTitle"
                  type="text"
                  />
              </div>
              : 
              <div className="">
                {t.title}
                <OpacityButton>
                  <FaEraser 
                  className="inline-block" 
                  onClick={() => this.deleteTask(t)} 
                  size={16}/>
                </OpacityButton>
                <OpacityButton>
                  <BiEdit 
                  className="inline-block" 
                  onClick={() => this.startEdit(t)} 
                  size={20}/>
                </OpacityButton>
              </div>}
              
            </li>
        );
    })
    : [];
return (
      <div className="bg-gray-200 flex flex-col">
        {createTask
        ?
        <CreateTaskModal state={this.state} setParentState={this.setState}/>
        :
        null}
        <button 
        className="w-auto m-2 hover:opacity-50 border-2 border-gray-800 flex rounded-md place-items-center"
        onClick={() => this.setState({...this.state, createTask: true})}>
          < AiOutlinePlus size={22} className="ml-1"/>
          <span className="mx-2">Create Task</span>
        </button>
        <ul className="m-2">
          {tasksLoading ? <li>loading...</li> : taskList}
        </ul>
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