import React from "react";
import CubeImage from "./cubeImage";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Row, Col } from "react-bootstrap";
import _ from "lodash";

export default function CaseSetCard(props) {
  const { cases, details } = props.caseSet;
  return (
    <Col className="d-flex justify-content-center">
      <Button
        variant="light"
        style={{
          width: "500px",
        }}
        className="m-1 border"
        onClick={props.onClick}
      >
        <Card.Body>
          {/* <Card.Title></Card.Title> */}
          <Card.Text>
            <Row>
              <Col>
                <CubeImage
                  live
                  width="120"
                  height="120"
                  case={_.sample(cases).algs[0]}
                  mask={details.mask}
                  view={details.view}
                ></CubeImage>
              </Col>
              <Col className="d-flex align-items-center justify-content-center">
                <h3>
                  {" " + details.name + " "}
                  <i class="fa fa-caret-right" aria-hidden="true"></i>
                </h3>
              </Col>
              <Col>
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
