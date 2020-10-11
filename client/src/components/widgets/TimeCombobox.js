import React, { Component } from "react";
import PropTypes from 'prop-types';

import { AiOutlineDown } from 'react-icons/ai';

const HOURS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];
const MIN_BREAKPOINTS = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
const AM_PM = ['am', 'pm'];
const VALUES = [HOURS, MIN_BREAKPOINTS, AM_PM];
// const TEXT_SIZE = "sm";
const TEXT_SIZE = "";

const getIndex = desc => {
    return (desc === "HOURS") ? 0 : ((desc === "MINS") ? 1 : -1);
};

class TimeCombobox extends Component {
    state = {
        dropdownOpen: false, 
        selected: ["", ""]
    };

    componentDidMount() {
        this.setState({ ...this.state });
    }

    onChange = e => {
        this.props.onChange(e);
        this.setState({ ...this.state });
    }

    componentDidUpdate() {
    }

    onClick = (e, v, desc) => {
        let selectedCopy = [...this.state.selected];
        const index = getIndex(desc);
        selectedCopy[index] = v;
        if (!selectedCopy.includes("")) {
            e.target.id = this.props.id;
            e.target.value = selectedCopy[0] + ":" + selectedCopy[1];
            this.onChange(e);
            this.setState({ ...this.state, selected: selectedCopy, dropdownOpen: false });
        } else {
            this.setState({ ...this.state, selected: selectedCopy });
        }
    }

    renderItem = (v, desc) => {
        const index = getIndex(desc);
        const isSelected = v === this.state.selected[index];
        return (
            <li key={v} 
            tabIndex={0}
            className="w-full cursor-pointer outline-none">
                <div
                    className={`${isSelected ? 'bg-blue-400' :'hover:bg-blue-100'} w-full text-center`}
                    onClick={e => this.onClick(e, v, desc)}>
                    <span 
                    className={`${TEXT_SIZE === 'sm' ? 'text-sm' : ''}`}>
                        {v}
                    </span>
                </div>
            </li>
        );
    }

    onBlur = e => {
        // by default, onBlur is fired before the object gaining focus receives it (making it impossible to click on the dropdown)
        // needed to make the the dropdown focusable (by adding tabindex=0) and check to see if the object gaining focus was a child
        // of the object losing focus. currentTarget is the object losing focus, relatedTarget is the object gaining it.
        if (!e.currentTarget.contains(e.relatedTarget)) {
            this.setState({ ...this.state, dropdownOpen: false });
        }
    }

    render() {
        const { value, id } = this.props;
        let hours = HOURS.map((h, i) => {
            return this.renderItem(h, "HOURS");
        });
        let mins = MIN_BREAKPOINTS.map((m, i) => {
            return this.renderItem(m, "MINS");
        });
        return (
            <div className="relative w-24" style={{...this.props.style}} onBlur={this.onBlur}>
                <input
                    autoComplete="off"
                    className={`${TEXT_SIZE === 'sm' ? 'text-sm' : ''} pl-1 w-full pr-6 border rounded-sm outline-none`}
                    type="text"
                    onChange={this.onChange}
                    onFocus={(e) => this.setState({ ...this.state, dropdownOpen: true })}
                    value={value}
                    id={id}
                    placeholder={"hh:mm"}
                />
                <div className="absolute top-0 right-0 w-6 cursor-pointer h-full border-l rounded-r-sm"
                    onClick={(e) => this.setState({ ...this.state, dropdownOpen: !this.state.dropdownOpen })}>
                    <AiOutlineDown className="block m-auto pt-1" size={20} />
                </div>
                {this.state.dropdownOpen
                    ?
                    <div className="absolute z-10 bot-0 left-0 w-full flex flex-row bg-white">
                        <div className="w-1/2 border">
                            <ul
                            className="h-full w-full flex flex-col justify-around items-center">
                                {hours}
                            </ul>
                        </div>
                        <div className="w-1/2 border">
                            <ul 
                            className="flex flex-col justify-around h-full w-full items-center">
                                {mins}
                            </ul>
                        </div>
                    </div>
                    : null
                }
            </div>
        );
    }
}

TimeCombobox.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    style: PropTypes.object
};

export default TimeCombobox;