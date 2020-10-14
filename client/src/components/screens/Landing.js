import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser, registerUser } from "../../actions/authActions";
import classnames from "classnames";

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

class LoginForm extends Component {
  state = {
    email: "",
    password: "",
    errors: {}
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData);
  };

  render() {
    const { errors } = this.props;

    return (
      <form noValidate onSubmit={this.onSubmit}>
        <div
          className="">
          <input
            className="mx-2"
            onChange={this.onChange}
            value={this.state.email}
            id="email"
            type="email"
          />
          <label
            className="mx-2"
            htmlFor="email">
            Email
          </label>
          <span className="text-red-500">
            {errors.email}
            {errors.emailnotfound}
          </span>
        </div>
        <div className="input-field col s12">
          <input
            onChange={this.onChange}
            value={this.state.password}
            id="password"
            type="password"
          />
          <label htmlFor="password">Password</label>
          <span className="red-text">
            {errors.password}
            {errors.passwordincorrect}
          </span>
        </div>
        <div className="col s12" style={{ paddingLeft: "11.250px" }}>
          <button
            style={{
              width: "150px",
              borderRadius: "3px",
              letterSpacing: "1.5px",
              marginTop: "1rem"
            }}
            type="submit"
            className="btn btn-large waves-effect waves-light hoverable blue accent-3"
          >
            Login
                </button>
        </div>
      </form>
    );
  }
}

const ConnectedLoginForm = connect(
  mapStateToProps,
  { loginUser }
)(LoginForm);

class RegisterForm extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    password2: "",
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { errors } = this.props;

    return (
      <form noValidate onSubmit={this.onSubmit}>
        <div className="input-field col s12">
          <input
            onChange={this.onChange}
            value={this.state.name}
            error={errors.name}
            id="name"
            type="text"
            className={classnames("", {
              invalid: errors.name
            })}
          />
          <label htmlFor="name">Name</label>
          <span className="red-text">{errors.name}</span>
        </div>
        <div className="input-field col s12">
          <input
            onChange={this.onChange}
            value={this.state.email}
            error={errors.email}
            id="email"
            type="email"
            className={classnames("", {
              invalid: errors.email
            })}
          />
          <label htmlFor="email">Email</label>
        </div>
        <div className="input-field col s12">
          <input
            onChange={this.onChange}
            value={this.state.password}
            error={errors.password}
            id="password"
            type="password"
          />
          <label htmlFor="password">Password</label>
          <span className="red-text">{errors.password}</span>
        </div>
        <div className="input-field col s12">
          <input
            onChange={this.onChange}
            value={this.state.password2}
            error={errors.password2}
            id="password2"
            type="password"
            className={classnames("", {
              invalid: errors.password2
            })}
          />
          <label htmlFor="password2">Confirm Password</label>
          <span className="red-text">{errors.password2}</span>
        </div>
        <div className="col s12" style={{ paddingLeft: "11.250px" }}>
          <button
            style={{
              width: "150px",
              borderRadius: "3px",
              letterSpacing: "1.5px",
              marginTop: "1rem"
            }}
            type="submit"
            className="btn btn-large waves-effect waves-light hoverable blue accent-3"
          >
            Sign up
                </button>
        </div>
      </form>
    );
  }
}

const ConnectedRegisterForm = connect(
  mapStateToProps,
  { registerUser }
)(RegisterForm);

class Landing extends Component {
  state = {
    signIn: true,
    signUp: false
  }

  componentDidMount() {
    // If logged in and user navigates to Landing page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/home");
    }
  }

  componentDidUpdate() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/home");
    }
  }

  render() {
    const { errors } = this.props;
    return (
      <div
        className="bg-gradient-to-tl from-teal-400 to-blue-500 h-full w-full flex place-items-center">
        <div
          style={{ height: "50%" }}
          className="bg-white rounded-lg w-1/2 mx-auto flex flex-col">
          <div
            id="signin signup container"
            className="flex flex-row w-full justify-around my-4">
            <span
              onClick={() => this.setState({ ...this.state, signIn: true, signUp: false })}>
              Sign in
            </span>
            <span
              onClick={() => this.setState({ ...this.state, signIn: false, signUp: true })}>
              Sign up
            </span>
          </div>
          <div
            id="form container"
          >
            {this.state.signIn
              ?
              <ConnectedLoginForm />
              :
              <ConnectedRegisterForm />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps
)(Landing);
