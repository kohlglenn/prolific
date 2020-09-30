import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import BulletList from "../widgets/BulletList";
import NavBar from "../widgets/NavBar";

class Dashboard extends Component {
  

  render() {
    const { user } = this.props.auth;
    return (
      <div className="inline-flex">
        <NavBar />
        <div>
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