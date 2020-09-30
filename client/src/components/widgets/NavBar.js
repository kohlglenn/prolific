import React, { Component } from "react";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';
import { COLORS } from "../constants";

class Header extends Component {
    state = {

    };

    componentDidMount() {

    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };


    render() {
        return (
            <div class="flex h-screen bg-gray-800 w-64 flex-col justify-between">
                <div class="">
                    <div className="flex flex-row-reverse justify-items-end p-2">
                        <AiOutlineMenuFold size={32} color={COLORS.grey} />
                    </div>
                    <button>
                        Home
                    </button>
                </div>
                <div class="">
                    <button className="p-2"
                        style={}
                        onClick={this.onLogoutClick}>
                        Logout
                    </button>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => ({

});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Header);