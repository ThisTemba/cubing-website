import React from "react";
import { Button } from "react-bootstrap";
import ollCaseSet from "../data/ollCaseSet";
import pllCaseSet from "../data/pllCaseSet";
import useLocalStorage from "../hooks/useLocalStorage";
import SelectCaseSet from "./selectCaseSet";
import CaseSetTable from "./caseSetTable";
import _ from "lodash";

export default function CaseSetDashboard(props) {
  const [selectedCaseSetId, setSelectedCaseSetId] = useLocalStorage(
    "selectedCaseSetId",
    null
  );
  const caseSets = [ollCaseSet, pllCaseSet];

  return (
    <div>
      {!selectedCaseSetId && (
        <SelectCaseSet caseSets={caseSets} onClick={setSelectedCaseSetId} />
      )}
      {selectedCaseSetId && (
        <div>
          <Button onClick={() => setSelectedCaseSetId(null)} className="m-1">
            Select New Case Set
          </Button>
          <CaseSetTable
            caseSet={_(caseSets).find(["details.id", selectedCaseSetId])}
          />
        </div>
      )}
    </div>
  );
}
