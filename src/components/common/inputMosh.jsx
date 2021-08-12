import React from "react";
import { Form, Alert } from "react-bootstrap";

const InputMosh = ({ name, label, error, ...rest }) => {
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Form.Control {...rest} name={name} id={name} />
      {error && <Alert variant="danger">{error}</Alert>}
    </Form.Group>
  );
};

export default InputMosh;
