import React from "react";
import { NavLink } from "@remix-run/react";

function NavItem(props) {
  // console.log("MenuItem props:" + JSON.stringify(props));

  return (
    <li className="nav-item">
      <NavLink to={props.target} className="nav-link">
        {props.label}
      </NavLink>
    </li>
  );
}

function MyLogout() {
  return (
    <form action="/logout" method="post">
      <button type="submit" className="button">
        Logout
      </button>
    </form>
  );
}

export default function NavNon(props) {
  //console.log("\n\n nav props: " + JSON.stringify(props));

  // logged - admin
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          NSF CRM
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo02"
          aria-controls="navbarTogglerDemo02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="d-flex mr-150">
          <ul className="nav nav-tabs">
            {props.showRegister ? (
              <li className="nav-item dropdown">
                <NavLink
                  to="/register"
                  className="dropdown-item flex-sm-fill text-sm-left nav-link"
                >
                  Register
                </NavLink>
              </li>
            ) : (
              <></>
            )}
            {props.showLogin ? (
              <li className="nav-item dropdown">
                <NavLink
                  to="/login"
                  className="dropdown-item flex-sm-fill text-sm-left nav-link"
                >
                  Login
                </NavLink>
              </li>
            ) : (
              <></>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
