import React, { useEffect, useState, useMemo } from "react";
import { Button, Card, Col, Row, Container } from "react-bootstrap";
import { useExpanded, useGroupBy, useTable } from "react-table";
import _ from "lodash";
import Timer from "../common/cubing/timer";
import ReactTable from "../common/reactTable";
import ButtonGroupToggle from "../common/buttonGroupToggle";
import { displayDur } from "../../utils/formatTime";
import { useAuthState } from "../../fire";
import { writeCasesToFirebase } from "../../utils/writeCases";
import { getSTM } from "../../utils/algTools";
import balancedRandomIndex from "../../utils/balancedRandom";

export default function TestPage(props) {
  const { selectedCases, caseSetDetails } = props;
  const [currentCase, setCurrentCase] = useState(selectedCases[0]);
  const [solves, setSolves] = useState([]);
  const user = useAuthState();

  useEffect(() => {
    const counts = selectedCases.map((c) => {
      if (solves.length) {
        const count = _.countBy(solves, "caseId")[c.id];
        if (count === undefined) return 0;
        else return count;
      } else {
        return 0;
      }
    });
    const index = balancedRandomIndex(counts);
    setCurrentCase(selectedCases[index]);
  }, [selectedCases, solves]);

  const handleNewCaseSolve = (solve, c) => {
    solve = {
      caseId: c.id,
      dur: solve.dur,
      hesitated: false,
      mistakes: 0,
      caseName: c.name,
      tps: getSTM(c.algs[0]) / solve.dur,
      alg: c.algs[0],
      dateTime: solve.dateTime,
    };
    // latest solve at the top
    setSolves([solve, ...solves]);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "caseName",
      },
      {
        Header: "Time",
        accessor: "dur",
        aggregate: "average",
        Aggregated: ({ value }) => displayDur(value),
      },
      {
        Header: "Hesitated",
        accessor: "hesitated",
        aggregate: (bools) => bools.filter(Boolean).length / bools.length,
        Cell: ({ value }) => JSON.stringify(value),
        Aggregated: ({ value }) => _.round(value, 2),
      },
      {
        Header: "Mistakes",
        accessor: "mistakes",
        Cell: ({ value }) => {
          return value === 0
            ? "none"
            : value === 1
            ? "minor"
            : value === 2
            ? "critical"
            : "";
        },
      },
    ],
    []
  );
  // const data = useMemo(() => solves, []);
  const data = solves;
  const table = useTable(
    {
      columns,
      data,
      initialState: {
        groupBy: ["caseName"],
      },
    },
    useGroupBy,
    useExpanded
  );

  let mistakesButtons = [
    { symbol: "check", id: 0, color: "success" },
    { symbol: "minus", id: 1, color: "warning" },
    { symbol: "times", id: 2, color: "danger" },
  ].map((b) => {
    return { ...b, content: <i className={`fa fa-${b.symbol}`}></i> };
  });

  const hesitationButton = [
    {
      content: <i className="fa fa-spinner" aria-hidden="true"></i>,
      id: "hesitated",
    },
  ];

  const handleSelectMistake = (mistakes) => {
    const newSolves = [...solves];
    newSolves[0].mistakes = mistakes;
    setSolves(newSolves);
    document.activeElement.blur();
  };

  const handleToggleHesitation = () => {
    const newSolves = [...solves];
    newSolves[0].hesitated = !newSolves[0].hesitated;
    setSolves(newSolves);
    document.activeElement.blur();
  };

  const handleBackToDash = () => {
    props.history.push("/train");
    props.onDashboard();
    console.table("solves", solves);
    console.log("caseSetDetails", caseSetDetails);
    const caseIds = _.uniqBy(solves, "caseId").map((c) => c.caseId);
    writeCasesToFirebase(solves, caseIds, caseSetDetails, user);
  };

  return (
    <Container>
      <Row>
        <Col>
          <Button
            onClick={() => {
              props.history.push("/train");
              props.onDashboard();
            }}
            variant="secondary"
            className="m-1"
          >
            <i className="fa fa-chevron-left" aria-hidden="true"></i>
          </Button>
          <Button
            onClick={handleBackToDash}
            variant="secondary"
            className="m-1"
          >
            <i className="fa fa-chevron-left" aria-hidden="true"></i> Back to
            Dashboard
          </Button>
        </Col>
        <Col></Col>
        <Col></Col>
        <Col></Col>
      </Row>
      <Timer
        onNewSolve={(solve) => handleNewCaseSolve(solve, currentCase)}
        scramble={_.sample(currentCase.scrambles)}
        armingTime={100}
      />
      {solves.length > 0 && (
        <Card>
          <Row>
            <Col>
              <strong>{"Solve: " + solves.length + "."}</strong>{" "}
              {"Case: " + solves[0].caseName}{" "}
              <ButtonGroupToggle
                buttons={hesitationButton}
                onSelect={() => handleToggleHesitation()}
                activeId={solves[0].hesitated ? "hesitated" : ""}
              />
              <ButtonGroupToggle
                buttons={mistakesButtons}
                onSelect={(id) => handleSelectMistake(id)}
                activeId={solves[0] ? solves[0].mistakes : null}
              />
            </Col>
          </Row>
        </Card>
      )}
      <ReactTable table={table} />
    </Container>
  );
}
