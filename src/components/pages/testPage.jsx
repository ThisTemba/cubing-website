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
      >
        Back to Dashboard
      </Button>
    </Container>
  );
}
