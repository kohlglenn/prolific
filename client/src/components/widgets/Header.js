import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Header extends Component {
  state = {
    name: ""
  };

  componentDidMount() {
      const { name } = this.props.auth.user;
      this.setState({...this.state, name: name});
  }

  
  render() {
    return (
      <div>
        <div className="inline-block ml-4">
          <span className="text-lg">Hey there, <span className="font-bold">{`${this.state.name}`}</span>!</span>
        </div>
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