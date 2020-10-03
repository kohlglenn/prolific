import React, { Component } from "react";
import { connect } from "react-redux";
import { createTask } from '../../actions/taskActions';
import { COLORS, progress, priority, bucket } from '../constants';
import { getDate, yyyymmddToDate, dateToYyyymmdd} from '../../utils/DateUtil';

import { AiOutlineClose } from "react-icons/ai";
import ProgressIcon from './ProgressIcon';
import PriorityIcon from "./PriorityIcon";


// REQUIRES: edit xor create to be true
class TaskModal extends Component {
    state = {
        ...this.props.state
    }

    componentDidMount() {
        if (this.props.create) {
            let date = getDate();
            this.setState({ 
                ...this.state, 
                owner: this.props.auth.user.id, 
                startDate: date, 
                priority: priority.MEDIUM,
                progress: progress.NONE,
                bucket: bucket.NONE });
        } else if (this.props.edit) {
            
        }
    }

    onChange = e => {
        // make sure the id of the component matches the state you want to change. e.g. group
        this.setState({ ...this.state, [e.target.id]: e.target.value });
    };

    handleSubmit = e => {
        e.preventDefault();
        if (this.props.create) {
            this.createTask(e);
        } else if (this.props.edit) {

        }
    }

    createTask = e => {
        // do date conversion
        let task = this.state;
        task.startDate = yyyymmddToDate(task.startDate);
        task.dueDate = task.dueDate ? yyyymmddToDate(task.dueDate) : undefined;
        this.props.createTask(task);
        this.resetState();
    };

    getGroups = () => {
        let allGroups = ["Default", this.state.group];
        allGroups = allGroups.filter(g => { return !!g; }) // filters out undefined and all other 'falsey' values
        return allGroups.map((g, i) => {
            return (
                <option key={`${g}${i}`} value={g}>{`${g}`}</option>
            );
        });
    };

    getAssigned = () => {
        const { name } = this.props.auth.user;
        let allAssigned = [name, this.state.assigned];
        allAssigned = allAssigned.filter(a => { return !!a; }) // filters out undefined and all other 'falsey' values

        return allAssigned.map((a, i) => {
            return (
                <option key={`${a}${i}`} value={a}>{`${a}`}</option>
            );
        });
    };

    getProgress = () => {
        return Object.values(progress).map((p, i) => {
            return (
                <option key={`${p}${i}`} value={p}>{`${p}`}</option>
            );
        });
    };

    getPriority = () => {
        return Object.values(priority).map((p, i) => {
            return (
                <option key={`${p}${i}`} value={p}>{`${p}`}</option>
            );
        });
    };

    getBuckets = () => {
        return Object.values(bucket).map((b, i) => {
            return (
                <option key={`${b}${i}`} value={b}>{`${b}`}</option>
            );
        });
    };

    resetState = () => {
        this.setState({
            title: "",
            group: "",
            assigned: "",
            bucket: bucket.NONE,
            progress: progress.NONE,
            priority: priority.MEDIUM,
            startDate: getDate(),
            dueDate: "",
            notes: "",
            subtasks: [],
            owner: this.state.owner
        });
    }

    closeModal = e => {
        this.resetState();
        this.props.closeModal();
    }

    render() {
        const { name } = this.props.auth.user;
        return (
            <div className="top-0 left-0 h-screen w-screen absolute z-10 flex place-items-center bg-black bg-opacity-50"
                style={{}}>
                <div className="bg-white w-1/2 m-auto rounded-lg max-w-sm">
                    <div className="flex flex-row-reverse place-items-start">
                            <AiOutlineClose onClick={this.closeModal} className="mt-2 mr-2 hover:opacity-50 cursor-pointer" size={20} color={COLORS.gray800} />
                    </div>
                    <form className="ml-2" onSubmit={this.handleSubmit}>
                        <div
                        className="my-1">
                            <span className="text-gray-500">
                                Title:
                            </span>
                            <input
                                className="ml-2"
                                required
                                onChange={this.onChange}
                                value={this.state.title}
                                id="title"
                                placeholder="Task title..."
                            />
                        </div>
                        <div className="my-1">
                            <span className="text-gray-500">
                                Group:
                            </span>
                            <select
                                className="ml-2 cursor-pointer"
                                value={this.state.group}
                                onChange={this.onChange}
                                id="group">
                                {this.getGroups()}
                                <option value="">None</option>
                            </select>
                        </div>
                        <div className="my-1">
                            <span className="text-gray-500">
                                Assigned:
                            </span>
                            <select
                                className="cursor-pointer"
                                value={this.state.assigned}
                                onChange={this.onChange}
                                id="assigned">
                                {this.getAssigned()}
                                <option value="">None</option>
                            </select>
                        </div>
                        <div className="flex flex-row place-items-center my-1">
                            <span className="text-gray-500">
                                Progress:
                            </span>
                            <select className="ml-2 cursor-pointer"
                                required
                                value={this.state.progress}
                                onChange={this.onChange}
                                id="progress">
                                {this.getProgress()}
                            </select>
                            <ProgressIcon className="ml-2" progress={this.state.progress} />
                        </div>
                        <div className="flex flex-row place-items-center my-1">
                            <span className="text-gray-500">
                                Priority:
                            </span>
                            <select className="ml-2 cursor-pointer"
                                required
                                value={this.state.priority}
                                onChange={this.onChange}
                                id="priority">
                                {this.getPriority()}
                            </select>
                            <PriorityIcon className="ml-2" priority={this.state.priority} />
                        </div>
                        <div className="flex flex-row place-items-center my-1">
                            <span className="text-gray-500">
                                Bucket:
                            </span>
                            <select className="ml-2 cursor-pointer"
                                required
                                value={this.state.bucket}
                                onChange={this.onChange}
                                id="bucket">
                                {this.getBuckets()}
                            </select>
                        </div>
                        <div className="my-1">
                            <span className="text-gray-500">Start Date: </span>
                            <input
                                className="ml-2 my-1 cursor-pointer"
                                required
                                type="date"
                                value={this.state.startDate}
                                onChange={this.onChange}
                                id="startDate" />
                        </div>
                        <div className="my-1">
                            <span className="text-gray-500">Due Date:</span>
                            <input
                                className="ml-2 my-1 cursor-pointer"
                                onChange={this.onChange}
                                type="date"
                                value={this.state.endDate}
                                id="dueDate" />
                        </div>
                        <div className="my-1">
                            <textarea
                                className="my-1"
                                id="notes"
                                value={this.state.notes}
                                onChange={this.onChange}
                                placeholder="Notes..."
                            />
                        </div>
                        <div className="w-full flex flex-row-reverse content-start">
                            <button
                                className="mr-4 mb-2 bg-transparent hover:bg-gray-600 border-2 border-gray-700 text-gray-700 rounded-lg hover:text-white hover:border-transparent"
                                type="submit">
                                <span className="m-2">
                                Create Task
                                </span>
                            </button>
                        </div>
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
)(TaskModal);