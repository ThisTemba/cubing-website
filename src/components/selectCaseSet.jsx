import React from "react";
import Row from "react-bootstrap/Row";
import CaseSetCard from "./common/cubing/caseSetCard";

export default function SelectCaseSet({ caseSets, onClick }) {
  return (
    <Row className="">
      {caseSets.map((c) => {
        const { id, name } = c.details;
        return <CaseSetCard title={name} onClick={() => onClick(id)} />;
      })}
    </Row>
  );
}
