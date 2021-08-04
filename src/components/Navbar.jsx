import React, { useState } from "react";
import { Navbar as NavbarRB, Nav, NavDropdown } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { auth, useAuthState } from "../fire";

export default function Navbar() {
  const [expanded, setExpanded] = useState(false);

  const collapse = () => setExpanded(false);

  const navLinks = [
    { label: "Time", to: "/time" },
    { label: "Train", to: "/train" },
    { label: "Stats", to: "/stats" },
  ];

  const user = useAuthState();
  return (
    <NavbarRB
      expand="sm"
      className="mb-2 navbar-themed"
      onToggle={() => setExpanded(!expanded)}
      expanded={expanded}
    >
      <NavbarRB.Brand as={Link} to="/">
        Cubing Website
      </NavbarRB.Brand>
      <NavbarRB.Toggle aria-controls="basic-navbar-nav" />
      <NavbarRB.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {navLinks.map((item) => (
            <Nav.Link as={NavLink} to={item.to} onClick={collapse}>
              {item.label}
            </Nav.Link>
          ))}
        </Nav>
        <Nav>
          {user && (
            <NavDropdown title={user.email} id="basic-nav-dropdown">
              <NavDropdown.Item as={NavLink} to="/settings" onClick={collapse}>
                Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                as={Link}
                to="/login"
                onClick={() => {
                  collapse();
                  auth.signOut();
                }}
              >
                Sign Out
              </NavDropdown.Item>
            </NavDropdown>
          )}
          {!user && (
            <Nav.Link as={Link} to="/login" onClick={collapse}>
              Log In
            </Nav.Link>
          )}
        </Nav>
      </NavbarRB.Collapse>
    </NavbarRB>
  );
}
