import React from "react";

import { SYSTEM_TITLE } from "~/components/utils";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Roles } from "~/models/role";

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

export default function NavBar(props) {
  console.log("\n\n\n\n\n\n\n nav props: " + JSON.stringify(props, null, 2));

  const isAdmin = Roles.isAdmin(props.role);
  const isManager = Roles.isManager(props.role);

  if (!props.isLoggedIn) {
    return (
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container className="container-fluid">
          <Navbar.Brand href="#home">
            <SVGLogo />
            <span className="align-middle">{SYSTEM_TITLE}</span>
          </Navbar.Brand>
          <Nav className="me-auto">
            <p>You're not logged in</p>
          </Nav>
        </Container>
      </Navbar>
    );
  }
  //
  else {
    return (
      <>
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container fluid>
            <Navbar.Brand href="#home">
              <SVGLogo />
              <span className="align-middle">{SYSTEM_TITLE}</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/dashboard">Home</Nav.Link>
                <Nav.Link href="/organizations">Orgs</Nav.Link>
                <Nav.Link href="/persons">People</Nav.Link>
                <Nav.Link href="/opportunities">Opportunities</Nav.Link>
                {isManager || isAdmin ? (
                  <NavDropdown title="Setup" id="basic-nav-dropdown">
                    <Navbar.Text className="mx-5">Data Manager</Navbar.Text>
                    <NavDropdown.Item href="/orgIndustries" className="mx-5">
                      Org Industries
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/orgTypes" className="mx-5">
                      Org Types
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      href="/opportunityStatuses"
                      className="mx-5"
                    >
                      Opp Statuses
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      href="/opportunitySources"
                      className="mx-5"
                    >
                      Opp Sources
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/opportunityTypes" className="mx-5">
                      Opp Types
                    </NavDropdown.Item>

                    {isAdmin ? (
                      <>
                        <NavDropdown.Divider />
                        <Navbar.Text className="mx-5">
                          Administrator
                        </Navbar.Text>
                        <NavDropdown.Item href="/users" className="mx-5">
                          Users
                        </NavDropdown.Item>
                        <NavDropdown.Item
                          href="/registrations"
                          className="mx-5"
                        >
                          Registrations
                        </NavDropdown.Item>
                      </>
                    ) : (
                      <></>
                    )}
                  </NavDropdown>
                ) : (
                  <></>
                )}
              </Nav>
              <Nav className="d-flex">
                <NavDropdown
                  title={props.name}
                  id="basic-nav-dropdown"
                  className="me-5"
                >
                  <NavDropdown.Item href="/changepassword">
                    Change Password
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/logout">Log Out</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </>
    );
  }
}

/*
{isManager || isAdmin ? (
                  <NavDropdown title="Manager" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/orgIndustries">
                      Org Industries
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/orgTypes">
                      Org Types
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="/opportunityStatuses">
                      Opp Statuses
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/opportunitySources">
                      Opp Sources
                    </NavDropdown.Item>
                    <NavDropdown.Item href="/opportunityTypes">
                      Opp Types
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <></>
                )}
                {isAdmin ? (
                  <NavDropdown title="Admin" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/users">Users</NavDropdown.Item>
                    <NavDropdown.Item href="/registrations">
                      Registrations
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <></>
                )}

 */
