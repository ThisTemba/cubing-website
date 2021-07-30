import React from "react";
import { Button } from "react-bootstrap";
import { Container } from "react-bootstrap";

export default function TestPage(props) {
  return (
    <Container>
      <h1>Test Page</h1>
      <Button
        onClick={() => {
          props.history.push("/train");
          props.onDashboard();
        }}
        variant="secondary"
        className="m-1"
      >
        <i className="fa fa-chevron-left" aria-hidden="true"></i>
        Back to Dashboard
      </Button>
    </Container>
  );
}
