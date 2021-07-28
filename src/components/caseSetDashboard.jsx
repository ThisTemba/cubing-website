import React from "react";
import CaseSetCard from "./common/cubing/caseSetCard";
import { Button, Row } from "react-bootstrap";
import ollCaseSet from "../data/ollCaseSet";
import pllCaseSet from "../data/pllCaseSet";
import useLocalStorage from "../hooks/useLocalStorage";
import SelectCaseSet from "./selectCaseSet";

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
        <Button onClick={() => setSelectedCaseSetId(null)}>
          Select New Case Set
        </Button>
      )}
    </div>
  );
}
