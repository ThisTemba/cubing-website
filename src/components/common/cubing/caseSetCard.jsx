import React from "react";
import CubeImage from "./cubeImage";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import _ from "lodash";

export default function CaseSetCard(props) {
  const { cases, details } = props.caseSet;
  return (
    <Col className="d-flex justify-content-center p-0" lg={6}>
      <Button
        variant="light"
        className="m-1 border btn-block"
        onClick={props.onClick}
      >
        <Card.Body className="p-2 p-sm-3">
          <Card.Text>
            <Row>
              <Col className="p-0">
                <CubeImage
                  live
                  width="120"
                  height="120"
                  case={_.sample(cases).algs[0]}
                  mask={details.mask}
                  view={details.view}
                ></CubeImage>
              </Col>
              <Col className="p-0 d-flex align-items-center justify-content-center">
                <h4>
                  {" " + details.name + " "}
                  <i className="fa fa-caret-right" aria-hidden="true"></i>
                </h4>
              </Col>
              <Col className="p-0">
                <CubeImage
                  width="120"
                  height="120"
                  mask={details.mask}
                  view={details.view}
                ></CubeImage>
              </Col>
            </Row>
          </Card.Text>
        </Card.Body>
      </Button>
    </Col>
  );
}
