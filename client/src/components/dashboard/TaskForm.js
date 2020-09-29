import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {getTasks, createTask} from '../../actions/taskActions';
import '../../tailwind.css';


class TaskForm extends Component {
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
        subtasks: []
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

render() {
    const { tasks, tasksLoading } = this.props.tasks;
    let taskList = tasks 
    ? tasks.map((t, i) => {
        return (
            <li key={i}>{t.title}</li>
        );
    })
    : [];
return (
      <div className="bg-red-300">
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
  { getTasks, createTask }
)(TaskForm);