import React from "react";
import CubeImage from "./cubeImage";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";

export default function CaseSetCard(props) {
  const { case1, mask1, mask2 } = props;
  return (
    <Col className="d-flex justify-content-center">
      <Card style={{ width: "500px" }} className="m-1">
        <Button variant="light">
          <Card.Body>
            <Row className="align-items-center">
              <Col>
                <CubeImage case={case1} mask={mask1} />
              </Col>
              <Col>
                <i class="fa fa-long-arrow-right fa-4x" aria-hidden="true"></i>
              </Col>
              <Col>
                <CubeImage mask={mask2} />
              </Col>
            </Row>
            <Card.Title>{props.title}</Card.Title>
          </Card.Body>
        </Button>
      </Card>
    </Col>
  );
}
