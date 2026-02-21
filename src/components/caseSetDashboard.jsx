import React, { useContext, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { FaIcon } from "../fontAwesome";
import _ from "lodash";
import BackButton from "./common/backButton";
import CaseSetsContext from "../hooks/useCaseSets";
import { UserContext } from "../services/firebase";
import SelectCaseSet from "./selectCaseSet";
import CaseSetTable from "./caseSetTable";
import resetCaseSet from "../utils/resetCaseSet";

function CaseSetDashboard(props) {
  const { caseSetDetails, setCaseSetDetails } = props;
  const { selectedCases, setSelectedCases } = props;
  const { onTest, onLearn } = props;
  const caseSets = useContext(CaseSetsContext);
  const { user } = useContext(UserContext);
  const selectedCaseSet = _(caseSets).find(["details.id", caseSetDetails?.id]);
  const [showResetModal, setShowResetModal] = useState(false);

  const title = selectedCaseSet?.details?.title;

  const handleResetConfirm = async () => {
    await resetCaseSet(user, caseSetDetails);
    setShowResetModal(false);
  };

  return (
    caseSets && (
      <>
        {!selectedCaseSet && (
          <SelectCaseSet caseSets={caseSets} onClick={setCaseSetDetails} />
        )}
        {selectedCaseSet && (
          <>
            <Row>
              <Col className="d-flex align-items-center p-0">
                <BackButton onClick={() => setCaseSetDetails(null)} />
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="m-1"
                  onClick={() => setShowResetModal(true)}
                >
                  <FaIcon icon="redo" /> Reset
                </Button>
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
            <Modal show={showResetModal} onHide={() => setShowResetModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Reset {title}?</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                This will permanently delete all solve history and stats for{" "}
                {title}. Chosen algorithms will be kept.
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowResetModal(false)}
                >
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleResetConfirm}>
                  Reset
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </>
    )
  );
}

export default CaseSetDashboard;
