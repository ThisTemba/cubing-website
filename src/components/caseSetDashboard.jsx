import React, { useState, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import useLocalStorage from "../hooks/useLocalStorage";
import useDarkMode from "../hooks/useDarkMode";
import ollCaseSet from "../data/ollCaseSet";
import pllCaseSet from "../data/pllCaseSet";
import eollCaseSet from "../data/eollCaseSet";
import ocllCaseSet from "../data/ocllCaseSet";
import epllCaseSet from "../data/epllCaseSet";
import cpllCaseSet from "../data/cpllCaseSet";
import SelectCaseSet from "./selectCaseSet";
import CaseSetTable from "./caseSetTable";

function CaseSetDashboard(props) {
  const [darkMode] = useDarkMode();
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
    if (selectedCaseSet !== undefined) {
      props.setCaseSetDetails(selectedCaseSet.details);
    }
  }, [selectedCases]);

  const { onTest, onLearn } = props;
  const initData = selectedCaseSet?.cases.map((c) => ({
    ...c,
    alg: c.algs[0],
  }));

  const renderTopButtons = () => {
    return (
      <Row>
        <Col className="p-0">
          <Button
            onClick={() => setSelectedCaseSetId(null)}
            className="m-1"
            variant={darkMode ? "dark" : "secondary"}
          >
            <FontAwesomeIcon icon="chevron-left" /> Back to CaseSet Selection
          </Button>
        </Col>
        <Col className="justify-content-end d-flex p-0">
          <Button
            onClick={onLearn}
            className="m-1"
            variant="info"
            disabled={selectedCases.length === 0}
          >
            Learn <FontAwesomeIcon icon="chevron-right" />
          </Button>
          <Button
            onClick={onTest}
            className="m-1"
            variant="success"
            disabled={selectedCases.length < 2}
          >
            Test <FontAwesomeIcon icon="chevron-right" />
          </Button>
        </Col>
      </Row>
    );
  };

  return (
    <div>
      {!selectedCaseSetId && (
        <SelectCaseSet caseSets={caseSets} onClick={setSelectedCaseSetId} />
      )}
      {selectedCaseSetId && (
        <div>
          {renderTopButtons()}
          <CaseSetTable
            initData={initData}
            caseSet={selectedCaseSet}
            setSelectedCases={setSelectedCases}
          />
        </div>
      )}
    </div>
  );
}

export default CaseSetDashboard;
