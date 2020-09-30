import React, { Component } from "react";
import { Link } from "react-router-dom";
import '../../tailwind.css'


class Landing extends Component {
  render() {
    return (
      <div style={{ height: "75vh" }} class="container">
        <div class="flex-row">
          <div class="bg-blue-400 flex-col">
            <h4>
              <b>Build</b> a login/auth app with the{" "}
              <span style={{ fontFamily: "monospace" }}>MERN</span> stack from
              scratch
            </h4>
            <p className="flow-text grey-text text-darken-1">
              Create a (minimal) full-stack app with user authentication via
              passport and JWTs
            </p>
            <br />
            <div class="flex-col">
                <Link
                    to="/register"
                    style={{
                    width: "140px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px"
                    }}
                    class=""
                >
                    Register
                </Link>
            </div>
            <div className="col s6">
            <Link
                to="/login"
                style={{
                  width: "140px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px"
                }}
                className="btn btn-large btn-flat waves-effect white black-text"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Landing;