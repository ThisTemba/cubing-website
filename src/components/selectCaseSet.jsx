import React from "react";
import Row from "react-bootstrap/Row";
import CaseSetCard from "./common/cubing/caseSetCard";

export default function SelectCaseSet({ caseSets, onClick }) {
  return (
    <Row>
      {caseSets.map((c) => {
        const { id } = c.details;
        return (
          <CaseSetCard
            caseSet={c}
            onClick={() => onClick(c.details)}
            key={id}
          />
        );
      })}
    </Row>
  );
}
