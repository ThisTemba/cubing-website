import React from "react";
import CubeImage from "./cubeImage";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";

export default function CaseSetCard(props) {
  return (
    <Col className="d-flex justify-content-center">
      <Button
        variant="light"
        style={{ width: "500px" }}
        className="m-1 border"
        onClick={props.onClick}
      >
        <Card.Body>
          <Card.Title>{props.title}</Card.Title>
        </Card.Body>
      </Button>
    </Col>
  );
}
