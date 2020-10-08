import React, { Component } from "react";
import PropTypes from 'prop-types';

import { AiOutlineDown } from 'react-icons/ai';

class Combobox extends Component {
    state = {
        dropdownOpen: false,
        goodValues: [],
        badValues: [],
        update: false
    };

    componentDidMount() {
        this.setState({ ...this.state, goodValues: [...this.props.values] });
    }

    onChange = e => {
        this.props.onChange(e);
        this.setState({ ...this.state, update: true });
    }

    componentDidUpdate() {
        const { badValues, goodValues, update } = this.state;
        if (update) {
            // Filter dropdown box on update
            // O(n) complexity. Don't think this will be a performance issue
            let worseValues = [...badValues];
            let betterValues = goodValues.filter(value => {
                if (value.includes(this.props.value)) {
                    return true;
                } else {
                    worseValues.push(value);
                }
            });
            worseValues = worseValues.filter(value => {
                if (value.includes(this.props.value)) {
                    betterValues.push(value);
                } else {
                    return true;
                }
            });
            this.setState({ ...this.state, goodValues: betterValues, badValues: worseValues, update: false });
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
            console.log(e.target.value);
            this.setState({ ...this.state, dropdownOpen: false });
        }
    }

    render() {
        const { value, id } = this.props;
        let values = this.state.goodValues.map((v, i) => {
            return this.renderItem(v);
        });
        return (
            <div className="relative w-32" onBlur={this.onBlur}>
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
    id: PropTypes.string.isRequired
};

export default Combobox;