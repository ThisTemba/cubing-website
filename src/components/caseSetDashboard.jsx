import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import ollCaseSet from "../data/ollCaseSet";
import pllCaseSet from "../data/pllCaseSet";
import eollCaseSet from "../data/eollCaseSet";
import ocllCaseSet from "../data/ocllCaseSet";
import epllCaseSet from "../data/epllCaseSet";
import cpllCaseSet from "../data/cpllCaseSet";
import useLocalStorage from "../hooks/useLocalStorage";
import SelectCaseSet from "./selectCaseSet";
import CaseSetTable from "./caseSetTable";
import _ from "lodash";

function CaseSetDashboard(props) {
  const [selectedCaseSetId, setSelectedCaseSetId] = useLocalStorage(
    "selectedCaseSetId",
    null
  );

  const caseSets = [
    eollCaseSet,
    ocllCaseSet,
    cpllCaseSet,
    epllCaseSet,
    pllCaseSet,
    ollCaseSet,
  ];
  const selectedCaseSet = _(caseSets).find(["details.id", selectedCaseSetId]);
  const [selectedCases, setSelectedCases] = useState([]);

  useEffect(() => {
    props.setSelectedCases(selectedCases);
    props.setCaseSetDetails(selectedCaseSet.details);
  }, [selectedCases]);

  const { onTest, onLearn } = props;

  return (
    <div>
      {!selectedCaseSetId && (
        <SelectCaseSet caseSets={caseSets} onClick={setSelectedCaseSetId} />
      )}
      {selectedCaseSetId && (
        <div>
          <Row>
            <Col>
              <Button
                onClick={() => setSelectedCaseSetId(null)}
                className="m-1"
                variant="secondary"
              >
                <i className="fa fa-chevron-left" aria-hidden="true"></i> Back
                to CaseSet Selection
              </Button>
            </Col>
            <Col></Col>
            <Col></Col>
            <Col>
              <Button
                onClick={onLearn}
                className="m-1"
                variant="info"
                disabled={selectedCases.length === 0}
              >
                Learn <i className="fa fa-chevron-right" aria-hidden="true"></i>
              </Button>
              <Button
                onClick={onTest}
                className="m-1"
                variant="success"
                disabled={selectedCases.length === 0}
              >
                Test <i className="fa fa-chevron-right" aria-hidden="true"></i>
              </Button>
            </Col>
          </Row>

          <CaseSetTable
            caseSet={selectedCaseSet}
            setSelectedCases={setSelectedCases}
          />
        </div>
      )}
    </div>
  );
}

export default CaseSetDashboard;
