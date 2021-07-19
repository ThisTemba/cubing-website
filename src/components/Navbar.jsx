import React from "react";
import { Navbar as NavbarRB, Nav, NavDropdown } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { auth, useAuthState } from "../fire";

export default function Navbar() {
  const user = useAuthState();
  return (
    <NavbarRB bg="light" expand="sm" className="mb-2">
      <NavbarRB.Brand as={Link} to="/">
        GCW
      </NavbarRB.Brand>
      <NavbarRB.Toggle aria-controls="basic-navbar-nav" />
      <NavbarRB.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={NavLink} to="/time">
            Time
          </Nav.Link>
          <Nav.Link as={NavLink} to="/train">
            Train
          </Nav.Link>
          <Nav.Link as={NavLink} to="/stats">
            Stats
          </Nav.Link>
        </Nav>
        <Nav>
          {user && (
            <NavDropdown title={user.email} id="basic-nav-dropdown">
              <NavDropdown.Item>Account</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => auth.signOut()}>
                Sign Out
              </NavDropdown.Item>
            </NavDropdown>
          )}
          {!user && (
            <Nav.Link as={Link} to="/login">
              Log In
            </Nav.Link>
          )}
        </Nav>
      </NavbarRB.Collapse>
    </NavbarRB>
  );
}
