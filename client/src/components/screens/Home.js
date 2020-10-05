import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

import BulletList from "../widgets/BulletList";
import NavBar from "../widgets/NavBar";
import Header from "../widgets/Header";

class Dashboard extends Component {
  state = {
    isNavBarOpen: true
  }

  toggleNavBar = e => {
    e.preventDefault();
    this.setState({...this.state, isNavBarOpen: !this.state.isNavBarOpen});
  }

  render() {
    const { user } = this.props.auth;
    const { isNavBarOpen } = this.state;
    return (
      <div className={`inline-flex absolute top-0 left-0 transition-transform duration-300 transform ${isNavBarOpen ? "" : "-translate-x-48"}`}>
        <NavBar toggleOpen={this.toggleNavBar} isOpen={this.state.isNavBarOpen} />
        <div>
          <Header />
          <BulletList user={this.props.auth.user} />
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);