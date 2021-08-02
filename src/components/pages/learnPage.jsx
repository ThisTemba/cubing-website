import React from "react";
import { Button } from "react-bootstrap";
import { CaseImage } from "../common/cubing/cubeImage";
import ScrambleDisplay from "../common/cubing/scrambleDisplay";
import _ from "lodash";

export default function LearnPage(props) {
  const currentCase = props.selectedCases[0];
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
      <ScrambleDisplay
        scramble={"Scramble: " + _.sample(currentCase.scrambles)}
      />
      <ScrambleDisplay scramble={"Alg: " + currentCase.algs[0]} />
      <CaseImage
        size="200"
        case={currentCase}
        caseSetDetails={props.caseSetDetails}
      />
    </div>
  );
}
