import React from "react";
import { NavLink } from "@remix-run/react";
import { SYSTEM_TITLE } from "~/components/utils";

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

function ManagerNavItem(props) {
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

function ManagerNav({ children }) {
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
        Manager
      </a>
      <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
        {children}
      </ul>
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
export function SVGLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-person-workspace"
      viewBox="0 0 16 16"
    >
      <path d="M4 16s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-5.95a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
      <path d="M2 1a2 2 0 0 0-2 2v9.5A1.5 1.5 0 0 0 1.5 14h.653a5.4 5.4 0 0 1 1.066-2H1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v9h-2.219c.554.654.89 1.373 1.066 2h.653a1.5 1.5 0 0 0 1.5-1.5V3a2 2 0 0 0-2-2z" />
    </svg>
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
              <a className="navbar-brand align-middle" href="about">
                <SVGLogo />
                <span className="align-middle">{SYSTEM_TITLE}</span>
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
                  <NavItem
                    target="/opportunities"
                    label="Opportunities"
                    requireAdmin={false}
                  />
                  <ManagerNav>
                    <ManagerNavItem
                      target="/orgIndustries"
                      label="Org Industries"
                    />
                    <ManagerNavItem target="/orgTypes" label="Org Types" />

                    <ManagerNavItem
                      target="/opportunityStatuses"
                      label="Opp Statuses"
                    />
                    <ManagerNavItem
                      target="/opportunitySources"
                      label="Opp Sources"
                    />
                    <ManagerNavItem
                      target="/opportunityTypes"
                      label="Opp Types"
                    />
                  </ManagerNav>
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
    } else if (props.isManager) {
      // logged - admin
      return (
        <>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <a className="navbar-brand align-middle" href="about">
                <SVGLogo />
                <span className="align-middle">{SYSTEM_TITLE}</span>
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
                  <ManagerNav>
                    <ManagerNavItem
                      target="/orgIndustries"
                      label="Org Industries"
                    />
                    <ManagerNavItem target="/orgTypes" label="Org Types" />

                    <ManagerNavItem
                      target="/opportunityStatuses"
                      label="Opp Statuses"
                    />
                    <ManagerNavItem
                      target="/opportunitySources"
                      label="Opp Sources"
                    />
                    <ManagerNavItem
                      target="/opportunityTypes"
                      label="Opp Types"
                    />
                  </ManagerNav>
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

    //
    else {
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
