import React, { Component } from "react";

import { progress } from '../constants/';

// import { BsCircle, BsFillCircleFill, BsCircleHalf, BsDashCircle, BsExclamationCircle, BsInfoCircle, BsXCircle } from 'react-icons/bs'; bucket??
import { BsCircle, BsFillCircleFill, BsCircleHalf } from 'react-icons/bs';


// Prop of 'progess' is REQUIRED
class ProgressIcon extends Component {
    getProgress = () => {
        const p = this.props.progress;
        switch(p) {
            case progress.NONE:
                return (
                    <BsCircle size={20} color={"blue"} {...this.props} />
                );
            case progress.INPROGRESS:
                return (
                    <BsCircleHalf className="transform rotate-90" size={20} color={"blue"} {...this.props} />
                );
            case progress.DONE:
                return (
                    <BsFillCircleFill size={20} color={"green"} {...this.props} />
                );
            default:
                return (
                    <BsCircle size={20} color={"blue"} {...this.props} />
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