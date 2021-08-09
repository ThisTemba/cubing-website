import React from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { components } from "react-select";

export default function DeletableOption(props) {
  const { deletable, value } = props.data;
  return (
    <div className="d-flex justify-content-between">
      <components.Option {...props} />
      {deletable && (
        <Button
          variant="link"
          className="text-dark"
          onClick={() => props.onDelete(value)}
        >
          <FontAwesomeIcon icon="trash" />
        </Button>
      )}
    </div>
  );
}
