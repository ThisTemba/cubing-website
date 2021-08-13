import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import CaseImage from "./cubeImage";
import useDarkMode from "../../../hooks/useDarkMode";

export default function CaseSetCard(props) {
  const { cases, details } = props.caseSet;
  const { title, subTitle, subSubTitle } = details;
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
                <CaseImage
                  size="120"
                  alg={_.sample(cases).algs[0]}
                  caseSetDetails={details}
                ></CaseImage>
              </Col>
              <Col className="p-0 d-flex align-items-center justify-content-center">
                <Row>
                  <Col xs={12}>
                    <h4>
                      {`${title} `}
                      <FontAwesomeIcon icon="caret-right" />
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
                <CaseImage size="120" caseSetDetails={details}></CaseImage>
              </Col>
            </Row>
          </Card.Text>
        </Card.Body>
      </Button>
    </Col>
  );
}
