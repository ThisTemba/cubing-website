import React, { useContext } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { FaIcon } from "../../../fontAwesome";
import _ from "lodash";
import CaseImage from "./cubeImage";
import DarkModeContext from "../../../hooks/useDarkMode";
import useWindowDimensions from "../../../hooks/useWindowDimensions";

export default function CaseSetCard(props) {
  const { cases, details } = props.caseSet;
  const { title, subTitle } = details;
  const { darkMode } = useContext(DarkModeContext);
  const { xs } = useWindowDimensions();

  const cubeImageSize = xs ? "100" : "120";

  const renderStatuses = (details) => {
    const counts = details.status;
    const allLearned = counts[0] === 0 && counts[1] === 0;
    const noneLearned = counts[1] === 0 && counts[2] === 0;
    const green = "#28a745";
    const yellow = darkMode ? "#ffc107" : "#daa506";
    const gray = darkMode ? "#adb5bd" : "#495057";
    if (allLearned)
      return <span style={{ fontWeight: 600, color: green }}>Learned!</span>;
    if (noneLearned)
      return (
        <span style={{ fontWeight: 600, color: gray }}>{counts[0]} Cases</span>
      );
    return (
      <>
        <span style={{ fontWeight: 600, color: gray }}>{counts[0]}</span>
        {" | "}
        <span style={{ fontWeight: 600, color: yellow }}>{counts[1]}</span>
        {" | "}
        <span style={{ fontWeight: 600, color: green }}>{counts[2]}</span>
      </>
    );
  };

  const renderTitle = (title) => (
    <h4>
      {title} <FaIcon icon="caret-right" />
    </h4>
  );

  return (
    <Col className="d-flex justify-content-center p-0" lg={6}>
      <Button
        variant={darkMode ? "dark" : "light"}
        className="m-1 border btn-block"
        onClick={props.onClick}
      >
        <Card.Body className="p-2 p-sm-3">
          <Row>
            <Col className="p-0 d-flex align-items-center justify-content-center">
              <CaseImage
                size={cubeImageSize}
                alg={_.sample(cases).algs[0]}
                caseSetDetails={details}
              ></CaseImage>
            </Col>
            <Col className="p-0 d-flex align-items-center justify-content-center">
              <Row>
                <Col xs={12}>{renderTitle(title)}</Col>
                <Col xs={12}>{subTitle}</Col>
                <Col xs={12}>{renderStatuses(details)}</Col>
              </Row>
            </Col>
            <Col className="p-0 d-flex align-items-center justify-content-center">
              <CaseImage
                size={cubeImageSize}
                caseSetDetails={details}
              ></CaseImage>
            </Col>
          </Row>
        </Card.Body>
      </Button>
    </Col>
  );
}
