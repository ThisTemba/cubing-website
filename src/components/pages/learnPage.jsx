import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { CaseImage } from "../common/cubing/cubeImage";
import ScrambleDisplay from "../common/cubing/scrambleDisplay";
import _ from "lodash";

export default function LearnPage(props) {
  const [algVisible, setAlgVisible] = useState(true);
  const [currentCase, setCurrentCase] = useState(props.selectedCases[0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentCase(props.selectedCases[currentIndex]);
  }, [currentIndex]);

  const renderVisibilityButton = (algVisible) => {
    if (algVisible)
      return (
        <Button variant="light" onClick={() => setAlgVisible(false)}>
          <i class="fa fa-eye fa-lg" aria-hidden="true"></i>
        </Button>
      );
    else
      return (
        <Button variant="light" onClick={() => setAlgVisible(true)}>
          <i class="fa fa-eye-slash fa-lg" aria-hidden="true"></i>
        </Button>
      );
  };

  return (
    <div>
      <h1>Learn</h1>
      <Button
        onClick={() => {
          props.history.push("/train");
          props.onDashboard();
        }}
        variant="secondary"
        className="m-1"
      >
        <i className="fa fa-chevron-left" aria-hidden="true"></i> Back to
        Dashboard
      </Button>
      <h1>{currentCase.name}</h1>
      Show/Hide Algorithm: {renderVisibilityButton(algVisible)}
      {algVisible && (
        <ScrambleDisplay scramble={"Alg: " + currentCase.algs[0]} />
      )}
      <ScrambleDisplay
        scramble={"Scramble: " + _.sample(currentCase.scrambles)}
      />
      <CaseImage
        size="200"
        case={currentCase}
        caseSetDetails={props.caseSetDetails}
      />
    </div>
  );
}
