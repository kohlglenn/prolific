import React, { Component } from "react";
import PropTypes from 'prop-types';

import { AiOutlineDown } from 'react-icons/ai';

class Combobox extends Component {
    state = {
        dropdownOpen: false,
        goodValues: [],
        update: false, 
        lastLength: 0
    };

    componentDidMount() {
        this.setState({ ...this.state, goodValues: [...this.props.values], lastLength: this.props.value.length });
    }

    onChange = e => {
        this.props.onChange(e);
        this.setState({ ...this.state, update: true });
    }

    componentDidUpdate() {
        const { goodValues, lastLength, update } = this.state;
        if (update) {
            let betterValues;
            if (this.props.value.length < lastLength) { // remove chars so narrow filter
                betterValues = this.props.values.filter(value => {
                    if (value.includes(this.props.value)) {
                        return true;
                    }
                });
            } else { // add chars so reset to start and then narrow filter in order to preserve original ordering
                betterValues = goodValues.filter(value => {
                    if (value.includes(this.props.value)) {
                        return true;
                    }
                });
            }
            this.setState({ ...this.state, goodValues: betterValues, update: false, lastLength: this.props.value.length });
        }
    }

    onClick = (e, v) => {
        e.target.id = this.props.id;
        e.target.value = v;
        this.onChange(e);
        this.setState({ ...this.state, dropdownOpen: false });
    }

    renderItem = v => {
        return (
            <li key={v} tabIndex={0}>
                <div
                    className="hover:bg-blue-100"
                    onClick={e => this.onClick(e, v)}>
                    <span>{v}</span>
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
        let values = this.state.goodValues.map((v, i) => {
            return this.renderItem(v);
        });
        return (
            <div className="relative w-32" style={{...this.props.style}} onBlur={this.onBlur}>
                <input
                    className="pl-1 w-full pr-6 border rounded-sm outline-none"
                    type="text"
                    onChange={this.onChange}
                    onFocus={(e) => this.setState({ ...this.state, dropdownOpen: true })}
                    value={value}
                    id={id}
                />
                <div className="absolute top-0 right-0 w-6 cursor-pointer h-full border-l rounded-r-sm"
                    onClick={(e) => this.setState({ ...this.state, dropdownOpen: !this.state.dropdownOpen })}>
                    <AiOutlineDown className="block m-auto pt-1" size={20} />
                </div>
                {this.state.dropdownOpen
                    ?
                    <div className="absolute bot-0 left-0 w-full">
                        <div className="w-full border">
                            <ul>
                                {values}
                            </ul>
                        </div>
                    </div>
                    : null
                }
            </div>
        );
    }
}

Combobox.propTypes = {
    value: PropTypes.string.isRequired,
    values: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    style: PropTypes.object
};

export default Combobox;