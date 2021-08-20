import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { FaIcon } from "../../fontAwesome";
import DarkModeContext from "../../hooks/useDarkMode";

export default function BackButton({ onClick, ...rest }) {
  const { darkMode } = useContext(DarkModeContext);
  const buttonProps = {
    className: "m-1",
    variant: darkMode ? "dark" : "secondary",
    onClick,
    ...rest,
  };
  return (
    <Button {...buttonProps}>
      <FaIcon icon="chevron-left" /> Back
    </Button>
  );
}
