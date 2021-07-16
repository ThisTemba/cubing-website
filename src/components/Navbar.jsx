import React from "react";
import { Navbar as NavbarRB, Nav, NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <NavbarRB bg="dark" variant="dark" expand="md">
      <NavbarRB.Brand to="/">GCW</NavbarRB.Brand>
      <NavbarRB.Toggle aria-controls="basic-navbar-nav" />
      <NavbarRB.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={NavLink} to="/time">
            Time
          </Nav.Link>
          <Nav.Link as={NavLink} to="/train">
            Train
          </Nav.Link>
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item to="#action/3.1">Account</NavDropdown.Item>
            <NavDropdown.Item to="#action/3.3">Log Out</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Nav>
          <Nav.Link to="#home">Log Out</Nav.Link>
        </Nav>
      </NavbarRB.Collapse>
    </NavbarRB>
  );
}
