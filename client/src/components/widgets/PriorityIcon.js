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
                    <FiBarChart className="transform scale-x-flip-x bg-b" size={20} color={COLORS.blue500} />
                );
            case priority.MEDIUM:
                return (
                    <FiBarChart2 size={20} color={COLORS.orange500} />
                );
            case priority.HIGH:
                return (
                    <FiBarChart size={20} color={COLORS.red500} />
                );
            default:
                return (
                    <FiBarChart2 size={20} color={COLORS.orange500} />
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