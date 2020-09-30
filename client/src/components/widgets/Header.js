import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Header extends Component {
  state = {
    isAuthenticated: false
  };

  componentDidMount() {
    const { isAuthenticated } = this.props.auth;
    if (isAuthenticated) {
      const { user } = this.props.auth;
      this.setState({...this.state, isAuthenticated: isAuthenticated, user: user});
    }
  }

  
  render() {
    return (
      <div>
        {this.state.isAuthenticated
        ?
        <div className="inline-block">
          <h4>{`Hello, ${this.state.user.name}`}</h4>
        </div>
        :
        <div>
        </div>
        }
      </div>
    );
  }
}
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { }
)(Header);