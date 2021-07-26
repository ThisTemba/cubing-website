import React from "react";
import CaseSetCard from "./common/cubing/caseSetCard";
import { Row } from "react-bootstrap";

export default function CaseSetDashboard() {
  return (
    <div>
      <h1>Case Set Dashboard</h1>
      <Row className="">
        <CaseSetCard case1="r U R' U R U2 r'" mask1="oll" mask2="oll" />
        <CaseSetCard
          case1="R' U' R U D' R2 U R' U R U' R U' R2 D"
          mask1="ll"
          mask2="ll"
        />
      </Row>
    </div>
  );
}
