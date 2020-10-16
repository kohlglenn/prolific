import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser, registerUser } from "../../actions/authActions";

import { HiOutlineUser, HiOutlineLockClosed, HiOutlineMail, HiOutlineAtSymbol, HiOutlineCheck } from 'react-icons/hi';
import { FaGithubSquare, FaTwitterSquare, FaLinkedin } from 'react-icons/fa';

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
          style={{ height: "20rem" }}
          className="flex flex-col justify-around items-center">
          <div
            className="flex flex-col items-center w-full">
            <div
              className="w-2/3">
              <label
                className="text-sm text-gray-600">
                Email
            </label>
              <span className="text-red-500 ml-2">
                {errors.email}
                {errors.emailnotfound}
              </span>
            </div>
            <div
              className="relative w-2/3">
              <div
                className="absolute top-0 left-0 w-6 flex items-center justify-center h-full">
                <HiOutlineMail size={20} />
              </div>
              <input
                className="pl-6 border-b w-full text-xl outline-none border-blue-500"
                onChange={this.onChange}
                value={this.state.email}
                id="email"
                type="email"
              />
            </div>
          </div>
          <div
            className="flex flex-col items-center w-full">
            <div
              className="w-2/3">
              <label
                className="text-sm text-gray-600">
                Password
            </label>
            </div>
            <div
              className="relative w-2/3">
              <div
                className="absolute top-0 left-0 w-6 flex items-center justify-center h-full">
                <HiOutlineLockClosed size={20} />
              </div>
              <input
                className="pl-6 border-b w-full text-xl outline-none border-blue-500"
                onChange={this.onChange}
                value={this.state.password}
                id="password"
                type="password"
              />
            </div>
          </div>
          <button
            type="submit"
            className="text-xl bg-transparent hover:bg-blue-500 border border-blue-500 text-blue-500 rounded-lg hover:text-white hover:border-transparent text-center w-2/3">
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
        <div
          style={{ height: "20rem" }}
          className="flex flex-col justify-around items-center">
          <div
            className="flex flex-col items-center w-full">
            <div
              className="w-2/3">
              <label
                className="text-sm text-gray-600">
                Name
            </label>
              <span className="text-red-500 ml-2">
                {/* No name errors */}
              </span>
            </div>
            <div
              className="relative w-2/3">
              <div
                className="absolute top-0 left-0 w-6 flex items-center justify-center h-full">
                <HiOutlineUser size={20} />
              </div>
              <input
                className="pl-6 border-b w-full text-xl outline-none border-blue-500"
                onChange={this.onChange}
                value={this.state.name}
                id="name"
                type="name"
              />
            </div>
          </div>
          <div
            className="flex flex-col items-center w-full">
            <div
              className="w-2/3">
              <label
                className="text-sm text-gray-600">
                Email
            </label>
              <span className="text-red-500 ml-2">
                {errors.email}
                {errors.emailnotfound}
              </span>
            </div>
            <div
              className="relative w-2/3">
              <div
                className="absolute top-0 left-0 w-6 flex items-center justify-center h-full">
                <HiOutlineMail size={20} />
              </div>
              <input
                className="pl-6 border-b w-full text-xl outline-none border-blue-500"
                onChange={this.onChange}
                value={this.state.email}
                id="email"
                type="email"
              />
            </div>
          </div>
          <div
            className="flex flex-col items-center w-full">
            <div
              className="w-2/3">
              <label
                className="text-sm text-gray-600">
                Password
            </label>
              <span className="text-red-500 ml-2">
                {errors.password}
              </span>
            </div>
            <div
              className="relative w-2/3">
              <div
                className="absolute top-0 left-0 w-6 flex items-center justify-center h-full">
                <HiOutlineLockClosed size={20} />
              </div>
              <input
                className="pl-6 border-b w-full text-xl outline-none border-blue-500"
                onChange={this.onChange}
                value={this.state.password}
                id="password"
                type="password"
              />
            </div>
          </div>
          <div
            className="flex flex-col items-center w-full">
            <div
              className="w-2/3">
              <label
                className="text-sm text-gray-600">
                Confirm Password
            </label>
              <span className="text-red-500 ml-2">
                {errors.password2}
              </span>
            </div>
            <div
              className="relative w-2/3">
              <div
                className="absolute top-0 left-0 w-6 flex items-center justify-center h-full">
                <HiOutlineCheck size={20} />
              </div>
              <input
                className="pl-6 border-b w-full text-xl outline-none border-blue-500"
                onChange={this.onChange}
                value={this.state.password2}
                id="password2"
                type="password"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-2 text-xl bg-transparent hover:bg-blue-500 border border-blue-500 text-blue-500 rounded-lg hover:text-white hover:border-transparent text-center w-2/3">
            Register
        </button>
        </div>
      </form>
    );
  }
}

const ConnectedRegisterForm = connect(
  mapStateToProps,
  { registerUser }
)(withRouter(RegisterForm));

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
    const hashParam = this.props.location.hash.split('#');
    if (hashParam.includes('login')) {
      this.setState({ ...this.state, signUp: false, signIn: true });
    } else if (hashParam.includes('register')) {
      this.setState({ ...this.state, signUp: true, signIn: false });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/home");
    }
  }

  render() {
    return (
      <div
        className="bg-gradient-to-tl from-teal-400 to-blue-500 h-full w-full flex flex-col justify-around items-center">
        <div
          className="flex flex-row justify-center w-1/2 items-center h-16">
          <div
            className="mr-1">
            <HiOutlineAtSymbol size={36} />
          </div>
          <span
            className="text-6xl font-mono">
            Prolific
          </span>
        </div>
        <div
          style={{ height: "50%", maxWidth: "30rem", minWidth: "20rem" }}
          className="bg-white rounded-lg w-1/2 flex flex-col items-center">
          <div
            id="signin signup container"
            className="flex flex-row justify-between w-2/3 h-16 mb-4 items-end">
            <div
              className={`border-b-2 ${this.state.signIn ? "border-blue-500" : "hover:bg-blue-200 "} flex items-center justify-center px-4 cursor-pointer`}>
              <span
                className="text-lg font-mono font-light"
                onClick={() => this.setState({ ...this.state, signIn: true, signUp: false })}>
                Sign In
              </span>
            </div>
            <div
              className={`border-b-2 ${this.state.signUp ? "border-blue-500" : "hover:bg-blue-200 "} flex items-center justify-center px-4 cursor-pointer`}>
              <span
                className="text-lg font-mono font-light"
                onClick={() => this.setState({ ...this.state, signIn: false, signUp: true })}>
                Sign Up
              </span>
            </div>
          </div>
          <div
            id="form container"
            className="w-full"
          >
            {this.state.signIn
              ?
              <ConnectedLoginForm />
              :
              <ConnectedRegisterForm />
            }
          </div>
        </div>
        <div
          className="flex flex-row justify-around w-1/2 items-center h-16 flex-wrap"
          style={{ maxWidth: "30rem", minWidth: "20rem" }}>
          <Link
            to="/"
            className="text-sm hover:opacity-50 hover:underline text-black font-mono">
            About us
          </Link>
          <Link
            to="/"
            className="hover:opacity-50">
            <FaGithubSquare size={30} />
          </Link>
          <Link
            to="/"
            className="hover:opacity-50">
            <FaTwitterSquare size={30} />
          </Link>
          <Link
            to="/"
            className="hover:opacity-50">
            <FaLinkedin size={30} />
          </Link>
          <Link
            to="/"
            className="text-sm hover:opacity-50 hover:underline text-black font-mono">
            Contact us
          </Link>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps
)(Landing);
