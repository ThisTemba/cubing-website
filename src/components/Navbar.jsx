import React from "react";
import { Navbar as NavbarRB, Nav, NavDropdown } from "react-bootstrap";

export default function Navbar() {
  return (
    <NavbarRB bg="dark" variant="dark" expand="md">
      <NavbarRB.Brand href="#home">GCW</NavbarRB.Brand>
      <NavbarRB.Toggle aria-controls="basic-navbar-nav" />
      <NavbarRB.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#home">Time</Nav.Link>
          <Nav.Link href="#link">Train</Nav.Link>
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Account</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Log Out</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Nav>
          <Nav.Link href="#home">Log Out</Nav.Link>
        </Nav>
      </NavbarRB.Collapse>
    </NavbarRB>
  );
}
