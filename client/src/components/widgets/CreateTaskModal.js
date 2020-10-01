import React, { Component } from "react";
import { connect } from "react-redux";
import {createTask } from '../../actions/taskActions';

import { AiOutlinePlus } from "react-icons/ai";


class CreateTaskModal extends Component {
    state = this.props.state;

    componentDidMount() {
        this.setState({owner: this.props.auth.user.id});
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
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

    // TODO: Finish building create task form. Then work on edit task form. Maybe think about refactoring out info and passing edit or create as a flag
    render() {
        return (
            <div className="top-0 left-0 h-screen w-screen absolute z-10 flex place-items-center bg-black bg-opacity-50"
                style={{}}>
                <div className="bg-white w-1/2 h-64 m-auto rounded-lg">
                    <form onSubmit={this.createTask}>
                        <input
                            required
                            onChange={this.onChange}
                            value={this.state.title}
                            id="title"
                            placeholder="Task title..."
                        />
                        <button type="submit">
                            < AiOutlinePlus size={24} />
                        </button>
                    </form>
                </div>
            </div>
        );
    }
};

const mapStateToProps = state => ({
    auth: state.auth,
    tasks: state.tasks
});

export default connect(
    mapStateToProps,
    { createTask }
)(CreateTaskModal);