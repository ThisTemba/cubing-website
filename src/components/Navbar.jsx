import React, { useState, useContext } from "react";
import { Navbar as NavbarRB, Nav, NavDropdown, Button } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { FaIcon } from "../fontAwesome";
import { auth, UserContext } from "../services/firebase";
import DarkModeContext from "../hooks/useDarkMode";

export default function Navbar() {
  const [expanded, setExpanded] = useState(false);
  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const { user } = useContext(UserContext);

  const collapse = () => setExpanded(false);

  const navLinks = [
    { label: "Train", to: "/train" },
    { label: "Time", to: "/time" },
    { label: "Stats", to: "/stats" },
  ];

  return (
    <NavbarRB
      expand="sm"
      className="mb-2 navbar-themed text-center"
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
          <Button
            variant="link"
            className="text-secondary"
            onClick={() => {
              setDarkMode(!darkMode);
              document.activeElement.blur();
            }}
          >
            <FaIcon
              size="lg"
              icon={darkMode ? "moon" : "sun"}
              color={darkMode ? "" : "#707070"}
            />
          </Button>
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
