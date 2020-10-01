import React, { Component } from "react";
import { connect } from "react-redux";
import {createTask } from '../../actions/taskActions';

import { AiOutlinePlus } from "react-icons/ai";


class CreateTaskModal extends Component {
    state = {
        ...this.props.state, 
        }

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

    getGroups = () => {
        let allGroups = ["default", this.state.group];
        allGroups = allGroups.filter(g => {return !!g;}) // filters out undefined and all other 'falsey' values
        return allGroups.map((g,i) => {
            return (
            <option value={g}>{`${g}`}</option>
            );
        });
    };

    getAssigned = () => {
        const { name } = this.props.auth.user;
        let allAssigned = [name, this.state.group];
        allAssigned = allAssigned.filter(a => {return !!a;}) // filters out undefined and all other 'falsey' values
        return ["", ...allAssigned.map((a,i) => { //add back empty string
            return (
            <option value={a}>{`${a}`}</option>
            );
        })];
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
        const { name } = this.props.auth.user;
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
                        <div>
                            <span>
                                Group:
                            </span>
                            <select 
                            value={this.state.group} 
                            onChange={this.onChange}
                            id="group">
                                {this.getGroups()}
                            </select>
                        </div>
                        <span>{name}</span>
                        <div>
                            <span>
                                Assigned:
                            </span>
                            <select
                            value={this.state.assigned}
                            onChange={this.onChange}
                            id="assigned">
                                {this.getAssigned()}
                            </select>
                        </div>
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