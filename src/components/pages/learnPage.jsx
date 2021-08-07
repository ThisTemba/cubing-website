import React, { useState, useEffect } from "react";
import { Button, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { CaseImage } from "../common/cubing/cubeImage";
import ScrambleDisplay from "../common/cubing/scrambleDisplay";
import useDarkMode from "../../hooks/useDarkMode";

export default function LearnPage(props) {
  const [algVisible, setAlgVisible] = useState(true);
  const [currentCase, setCurrentCase] = useState(props.selectedCases[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [darkMode] = useDarkMode();

  const nextIndex = (rightOrLeft) => {
    console.log(currentIndex);
    const end = props.selectedCases.length - 1;
    if (rightOrLeft === "right") {
      if (currentIndex === end) setCurrentIndex(0);
      else setCurrentIndex(currentIndex + 1);
    }
    if (rightOrLeft === "left") {
      if (currentIndex === 0) setCurrentIndex(end);
      else setCurrentIndex(currentIndex - 1);
    }
    // TODO: account for negatives
  };

  useEffect(() => {
    setCurrentCase(props.selectedCases[currentIndex]);
  }, [currentIndex]);

  const renderVisibilityButton = (algVisible) => {
    return (
      <Button
        variant={darkMode ? "dark" : "light"}
        onClick={() => {
          setAlgVisible(!algVisible);
          document.activeElement.blur();
        }}
      >
        <FontAwesomeIcon icon={algVisible ? "eye" : "eye-slash"} />
      </Button>
    );
  };

  return (
    <div className="text-center">
      <Row>
        <Col className="text-left p-0">
          <Button
            onClick={() => {
              props.history.push("/train");
              props.onDashboard();
            }}
            variant="secondary"
            className="m-1"
          >
            <FontAwesomeIcon icon="chevron-left" /> Back to Dashboard
          </Button>
        </Col>
        <Col>
          <h2>Learn {`(${currentIndex + 1}/${props.selectedCases.length})`}</h2>
        </Col>
        <Col className="p-0"></Col>
      </Row>
      <Row className="mt-2">
        <Col className="text-left p-0 align-middle">
          <Button
            onClick={() => nextIndex("left")}
            className="m-1"
            variant={darkMode ? "dark" : "light"}
          >
            <FontAwesomeIcon icon="arrow-left" />
          </Button>
        </Col>
        <Col>
          <h1>{currentCase.name}</h1>
        </Col>
        <Col className="text-right p-0 align-middle">
          <Button
            onClick={() => nextIndex("right")}
            className="m-1"
            variant={darkMode ? "dark" : "light"}
          >
            <FontAwesomeIcon icon="arrow-right" />
          </Button>
        </Col>
      </Row>
      <ScrambleDisplay
        scramble={"Scramble: " + _.sample(currentCase.scrambles)}
      />
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <CaseImage
                live
                size="200"
                case={currentCase}
                caseSetDetails={props.caseSetDetails}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <iframe
                frameBorder="0"
                width="250"
                height="290"
                src={`https://ruwix.com/widget/3d/?alg=${currentCase.algs[0]}&speed=1000&colors=F:b%20L:o%20B:g%20R:r`}
                scrolling="no"
              ></iframe>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <div
        className="text-center mt-2"
        style={{
          fontFamily: "Monospace",
          textAlign: "center",
          fontSize: "30px",
        }}
      >
        {"Algorithm "}
        {renderVisibilityButton(algVisible)}
      </div>
      {algVisible && <ScrambleDisplay scramble={currentCase.algs[0]} />}
    </div>
  );
}
