import React, { Component } from "react";

import { COLORS, priority } from '../constants';
import { FiBarChart2, FiBarChart } from 'react-icons/fi';

// green orange red
// Prop of 'progess' is REQUIRED
class PriorityIcon extends Component {
    getPriority = () => {
        const p = this.props.priority;
        switch(p) {
            case priority.LOW:
                return (
                    <FiBarChart size={20} color={COLORS.blue500}  {...this.props}
                    className={`transform scale-x-flip-x ${this.props.className ? this.props.className : ""}`} />
                );
            case priority.MEDIUM:
                return (
                    <FiBarChart2 size={20} color={COLORS.orange500}  {...this.props} />
                );
            case priority.HIGH:
                return (
                    <FiBarChart size={20} color={COLORS.red500}  {...this.props} />
                );
            default:
                return (
                    <FiBarChart2 size={20} color={COLORS.orange500}  {...this.props} />
                );
        }
    }

    render() {
        return (
            <div>
                {this.getPriority()}
            </div>
        );
    }
};

export default PriorityIcon;