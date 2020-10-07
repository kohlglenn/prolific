import React, { Component } from "react";
import PropTypes from 'prop-types';

import { AiOutlineDown } from 'react-icons/ai';


//@param values REQUIRED the values to be dispalyed in dropdown
//@param value REQUIRED where the selected value AND/OR initial value is stored
//@param onChange REQUIRED function that mutates value based on either dropdown select or typing
//@param id REQUIRED id of the text input field
//@param initialValue OPTIONAL value you want to be displayed on open. Overwrites @param value
class Combobox extends Component {
    state = {
        dropdownOpen: false,
        valuesCopy: []
    };

    componentDidMount() {
        this.setState({ ...this.state, valuesCopy: [...this.props.values] });
    }

    onChange = e => {
        this.props.onChange(e);
    }

    onClick = (e,v) => {
        e.target.id = this.props.id;
        e.target.value = v;
        this.setState({...this.state, dropdownOpen: false});
        this.onChange(e);
    }

    renderItem = v => {
        return (
            <li key={v}>
                <div 
                className="hover:bg-blue-100" 
                onClick={e => this.onClick(e,v)}>
                    <span>{v}</span>
                </div>
            </li>
        );
    }

    render() {
        const { value, id } = this.props;
        let values = this.state.valuesCopy.map((v, i) => {
            return this.renderItem(v);
        });
        return (
            <div className="relative w-32">
                <input
                    className="pl-1 w-full pr-6 border rounded-sm outline-none"
                    type="text"
                    onChange={this.onChange}
                    value={value}
                    id={id}
                />
                <div className="absolute top-0 right-0 w-6 cursor-pointer h-full border-l rounded-r-sm"
                    onClick={(e) => this.setState({...this.state, dropdownOpen: !this.state.dropdownOpen})}>
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