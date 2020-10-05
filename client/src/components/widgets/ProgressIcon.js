import React, { Component } from "react";

import { progress } from '../constants/';

// import { BsCircle, BsFillCircleFill, BsCircleHalf, BsDashCircle, BsExclamationCircle, BsInfoCircle, BsXCircle } from 'react-icons/bs'; bucket??
import { BsCircle, BsFillCircleFill, BsCircleHalf, BsCheckCircle } from 'react-icons/bs';
import { AiFillCheckCircle, AiFillClockCircle } from 'react-icons/ai';
import {FaCheckCircle, FaClock, FaCircleNotch, FaRegCircle, FaRegClock } from 'react-icons/fa';


// Prop of 'progess' is REQUIRED
class ProgressIcon extends Component {
    getProgress = () => {
        const p = this.props.progress;
        switch(p) {
            case progress.NONE:
                return (
                    <FaRegCircle size={20} color={"blue"}  {...this.props} />
                );
            case progress.INPROGRESS:
                return (
                    <FaRegClock size={20} color={"orange"} {...this.props} />
                );
            case progress.DONE:
                return (
                    <FaCheckCircle size={20} color={"green"} {...this.props} />
                );
            default:
                return (
                    <FaCircleNotch size={20} color={"blue"} {...this.props} />
                );
        }
    }

    render() {
        return (
            <div>
                {this.getProgress()}
            </div>
        );
    }
};

export default ProgressIcon;