import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {getTasks, createTask, updateTask, deleteTask} from '../../actions/taskActions';
import '../../tailwind.css';
import { FaEraser } from "react-icons/fa";
import { BiEdit } from "react-icons/bi";
import OpacityButton from "../button/OpacityButton";

// Make a clickable icon component that has an opacity change

class BulletList extends Component {
    state = {
        title: "",
        group: "",
        owner: "",
        assigned: "",
        bucket: "",
        progress: "",
        priority: "",
        startDate: "",
        dueDate: "",
        notes: "",
        subtasks: [],
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
    
    createTask = e => {
        e.preventDefault();
        this.props.createTask(this.state);
        this.resetState();
    };

    deleteTask = t => {
      this.props.deleteTask(t._id);
    };
    
    editTask = t => {
      // TODO
    }

    resetState = () => {
        this.setState({
            title: "",
            group: "",
            owner: "",
            assigned: "",
            bucket: "",
            progress: "",
            priority: "",
            startDate: "",
            dueDate: "",
            notes: "",
            subtasks: []
        });
    }

  startEdit = t => {
    this.setState({...this.state, editMode: t._id, eTitle: t.title})
  };

render() {
    const { tasks, tasksLoading } = this.props.tasks;
    const { editMode } = this.state;
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
      <div className="bg-gray-200 p-2">
          <form onSubmit={this.createTask}>
              <input 
              required 
              onChange={this.onChange} 
              value={this.state.title}
              id="title"
              />
              <button type="submit">
              Create Task
            </button>
          </form>
          <ul>
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
  { getTasks, createTask, updateTask, deleteTask }
)(BulletList);