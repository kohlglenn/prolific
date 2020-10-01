import React, { Component } from "react";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { AiOutlineMenuFold, AiOutlineMenuUnfold, AiOutlineHome, AiOutlineUnorderedList } from 'react-icons/ai';
import { BsCalendar } from 'react-icons/bs';
import { FaRegStickyNote } from 'react-icons/fa';
import { RiLogoutBoxLine } from 'react-icons/ri';
import { COLORS } from "../constants";
import { Link } from "react-router-dom";

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
            <div
            style={{'border-top-right-radius': '1.5rem'}}
            class="flex h-screen bg-gray-800 w-64 flex-col justify-between p-2">
                <div class="p-2">
                    <div
                        className="flex flex-row-reverse justify-items-end hover:opacity-50">
                        <button>
                            <AiOutlineMenuFold size={32} color={COLORS.gray} />
                        </button>
                    </div>
                    <div
                        className="flex flex-row justify-items-start">
                        <ul>
                            <li>
                                <div className="flex h-32 flex-col place-content-between"> {/** Menu container */}
                                    <Link 
                                    to="/home" 
                                    className="hover:opacity-50 flex place-items-center" 
                                    style={{ color: COLORS.gray }}>
                                        <AiOutlineHome className="inline mr-3" size={22} color={COLORS.gray} />
                                        Home
                                    </Link>
                                    <Link 
                                    to="/home" 
                                    className="hover:opacity-50 flex place-items-center" 
                                    style={{ color: COLORS.gray }}>
                                        <BsCalendar className="inline mr-3" size={22} color={COLORS.gray} />
                                        Calendar
                                    </Link>
                                    <Link 
                                    to="/home" 
                                    className="hover:opacity-50 flex place-items-center" 
                                    style={{ color: COLORS.gray }}>
                                        <FaRegStickyNote className="inline mr-3" size={22} color={COLORS.gray} />
                                        Board
                                    </Link>
                                    <Link 
                                    to="/home" 
                                    className="hover:opacity-50 flex place-items-center" 
                                    style={{ color: COLORS.gray }}>
                                        <AiOutlineUnorderedList className="inline mr-3" size={22} color={COLORS.gray} />
                                        BulletList
                                    </Link>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="">
                    <button className="pb-10 p-2 hover:opacity-50"
                        style={{ color: COLORS.gray }}
                        onClick={this.onLogoutClick}>
                        <RiLogoutBoxLine className="inline mr-3" size={22} color={COLORS.gray} />
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