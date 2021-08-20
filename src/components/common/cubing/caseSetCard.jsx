import React, { useContext } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { FaIcon } from "../../../fontAwesome";
import _ from "lodash";
import CaseImage from "./cubeImage";
import MultiProgressBar from "../multiProgressBar";
import DarkModeContext from "../../../hooks/useDarkMode";

export default function CaseSetCard(props) {
  const { cases, details } = props.caseSet;
  const { title, subTitle, subSubTitle } = details;
  const { darkMode } = useContext(DarkModeContext);
  return (
    <Col className="d-flex justify-content-center p-0" lg={6}>
      <Button
        variant={darkMode ? "dark" : "light"}
        className="m-1 border btn-block p-1 pt-2"
        onClick={props.onClick}
      >
        <Card.Body className="p-2 p-sm-3">
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
                    <FaIcon icon="caret-right" />
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
        </Card.Body>
        {<MultiProgressBar />}
      </Button>
    </Col>
  );
}
