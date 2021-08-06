import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import _ from "lodash";
import CubeImage from "./cubeImage";
import useDarkMode from "../../../hooks/useDarkMode";

export default function CaseSetCard(props) {
  const { cases, details } = props.caseSet;
  const { title, subTitle, subSubTitle, view, mask } = details;
  const [darkMode] = useDarkMode();
  return (
    <Col className="d-flex justify-content-center p-0" lg={6}>
      <Button
        variant={darkMode ? "dark" : "light"}
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
                  mask={mask}
                  view={view}
                ></CubeImage>
              </Col>
              <Col className="p-0 d-flex align-items-center justify-content-center">
                <Row>
                  <Col xs={12}>
                    <h4>
                      {title + " "}
                      <i className="fa fa-caret-right" aria-hidden="true"></i>
                    </h4>
                  </Col>
                  <Col xs={12}>
                    {typeof subTitle !== "undefined" ? subTitle : ""}
                  </Col>
                  <Col>
                    {typeof subSubTitle !== "undefined" ? subSubTitle : ""}
                  </Col>
                </Row>
              </Col>
              <Col className="p-0">
                <CubeImage
                  width="120"
                  height="120"
                  mask={mask}
                  view={view}
                ></CubeImage>
              </Col>
            </Row>
          </Card.Text>
        </Card.Body>
      </Button>
    </Col>
  );
}
