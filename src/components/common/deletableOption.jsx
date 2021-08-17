import React from "react";
import { Button } from "react-bootstrap";
import { FaIcon } from "../../fontAwesome";
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
          <FaIcon icon="trash" />
        </Button>
      )}
    </div>
  );
}
