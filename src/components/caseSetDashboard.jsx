import React, { useContext } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { FaIcon } from "../fontAwesome";
import _ from "lodash";
import BackButton from "./common/backButton";
import CaseSetsContext from "../hooks/useCaseSets";
import SelectCaseSet from "./selectCaseSet";
import CaseSetTable from "./caseSetTable";

function CaseSetDashboard(props) {
  const { caseSetDetails, setCaseSetDetails } = props;
  const { selectedCases, setSelectedCases } = props;
  const { onTest, onLearn } = props;
  const caseSets = useContext(CaseSetsContext);
  const selectedCaseSet = _(caseSets).find(["details.id", caseSetDetails?.id]);

  return (
    caseSets && (
      <>
        {!selectedCaseSet && (
          <SelectCaseSet caseSets={caseSets} onClick={setCaseSetDetails} />
        )}
        {selectedCaseSet && (
          <>
            <Row>
              <Col className="p-0">
                <BackButton onClick={() => setCaseSetDetails(null)} />
              </Col>
              <Col className="justify-content-end d-flex p-0">
                <Button
                  onClick={onLearn}
                  className="m-1"
                  variant="info"
                  disabled={selectedCases.length === 0}
                >
                  Learn <FaIcon icon="chevron-right" />
                </Button>
                <Button
                  onClick={onTest}
                  className="m-1"
                  variant="success"
                  disabled={selectedCases.length < 2}
                >
                  Test <FaIcon icon="chevron-right" />
                </Button>
              </Col>
            </Row>
            <CaseSetTable
              caseSet={selectedCaseSet}
              setSelectedCases={setSelectedCases}
            />
          </>
        )}
      </>
    )
  );
}

export default CaseSetDashboard;
