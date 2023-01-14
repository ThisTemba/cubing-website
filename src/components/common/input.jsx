import React from "react";
import Form from "react-bootstrap/Form";

export default function Input({ id, label, value, setValue, type = "text" }) {
  return (
    <Form.Group id={id} className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      ></Form.Control>
    </Form.Group>
  );
}
