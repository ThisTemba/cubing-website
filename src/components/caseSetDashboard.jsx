import React from "react";
import CaseSetCard from "./common/cubing/caseSetCard";
import { Row, Col, Container } from "react-bootstrap";

export default function CaseSetDashboard() {
  return (
    <div>
      <h1>Case Set Dashboard</h1>
      <Row className="">
        <CaseSetCard alg1="r U R' U R U2 r'" stage1="oll" stage2="oll" />
        <CaseSetCard
          alg1="R' U' R U D' R2 U R' U R U' R U' R2 D"
          stage1="ll"
          stage2="ll"
        />
      </Row>
    </div>
  );
}
