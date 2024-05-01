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

function AdminNavItem(props) {
  // console.log("MenuItem props:" + JSON.stringify(props));

  return (
    <li className="nav-item">
      <NavLink to={props.target} className="nav-link">
        {props.label}
      </NavLink>
    </li>
  );
}

function AdminNav({ children }) {
  return (
    <li className="nav-item dropdown">
      <a
        className="nav-link dropdown-toggle"
        href="#"
        id="navbarDropdownMenuLink"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Admin
      </a>
      <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
        {children}
      </ul>
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

export default function Nav(props) {
  // console.log("\n\n nav props: " + JSON.stringify(props));

  if (props.isLoggedIn) {
    if (props.isAdmin) {
      // logged - admin
      return (
        <>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <a className="navbar-brand" href="about">
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
              <div
                className="collapse navbar-collapse"
                id="navbarTogglerDemo02"
              >
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <NavItem target="/dashboard" label="Home" />
                  <NavItem
                    target="/organizations"
                    label="Organizations"
                    requireAdmin={false}
                  />
                  <NavItem target="/persons" label="People" />
                  <AdminNav>
                    <AdminNavItem target="/users" label="Users" />
                    <AdminNavItem
                      target="/registrations"
                      label="Registrations"
                    />
                  </AdminNav>
                </ul>
              </div>
              <div className="d-flex mr-150">
                <ul className="nav nav-tabs">
                  <li className="nav-item dropdown">
                    <a
                      className="flex-sm-fill text-sm-left nav-link dropdown-toggle mr-5"
                      data-bs-toggle="dropdown"
                      href="#"
                      role="button"
                      aria-expanded="false"
                    >
                      {props.name} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </a>
                    <ul className="dropdown-menu">
                      <NavLink
                        to="/changepassword"
                        className="dropdown-item flex-sm-fill text-sm-left nav-link"
                      >
                        Change Password
                      </NavLink>
                      <NavLink
                        to="/logout"
                        className="dropdown-item flex-sm-fill text-sm-left nav-link"
                      >
                        Logout
                      </NavLink>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </>
      );
    } else {
      // logged in -- not admin
      return (
        <>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <a className="navbar-brand" href="about">
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
              <div
                className="collapse navbar-collapse"
                id="navbarTogglerDemo02"
              >
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <NavItem target="/dashboard" label="Home" />
                  <NavItem
                    target="/organizations"
                    label="Organizations"
                    requireAdmin={false}
                  />
                  <NavItem target="/persons" label="People" />
                </ul>
              </div>
              <div className="d-flex mr-150">
                <ul className="nav nav-tabs">
                  <li className="nav-item dropdown">
                    <a
                      className="flex-sm-fill text-sm-left nav-link dropdown-toggle mr-5"
                      data-bs-toggle="dropdown"
                      href="#"
                      role="button"
                      aria-expanded="false"
                    >
                      {props.name} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </a>
                    <ul className="dropdown-menu">
                      <NavLink
                        to="/changepassword"
                        className="dropdown-item flex-sm-fill text-sm-left nav-link"
                      >
                        Change Password
                      </NavLink>
                      <NavLink
                        to="/logout"
                        className="dropdown-item flex-sm-fill text-sm-left nav-link"
                      >
                        Logout
                      </NavLink>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </>
      );
    }
  } else {
    return (
      <>
        <p>You're not logged in</p>
      </>
    );
  }
}