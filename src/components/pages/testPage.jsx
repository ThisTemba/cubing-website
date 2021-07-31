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

export default function TestPage(props) {
  const { selectedCases, caseSetDetails } = props;
  const [currentCase, setCurrentCase] = useState(selectedCases[0]);
  const [currentScramble, setCurrentScramble] = useState("");
  const [solves, setSolves] = useState([]);
  const user = useAuthState();

  useEffect(() => {
    setCurrentScramble(getRandomScramble(selectedCases[0]));
  }, []);

  const prepareNextCase = () => {
    let currentCase = _.sample(selectedCases);
    setCurrentCase(currentCase);
    setCurrentScramble(getRandomScramble(currentCase));
  };

  const getRandomScramble = (c) => _.sample(c.scrambles);

  const handleNewCaseSolve = (solve, c, algSetDetails) => {
    prepareNextCase();

    const { dateTime, dur } = solve;

    solve = {
      caseId: c.id,
      dur,
      hesitated: false,
      mistakes: null,
      caseName: c.name,
      alg: c.algs[0],
      dateTime,
    };
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
    { sym: "check", id: 0, color: "success" },
    { sym: "minus", id: 1, color: "warning" },
    { sym: "times", id: 2, color: "danger" },
  ];
  mistakesButtons = mistakesButtons.map((b) => {
    return { ...b, content: <i className={`fa fa-${b.sym}`}></i> };
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
    // dehover buttons after clicking
  };

  const handleToggleHesitation = (dateTime) => {
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
        <Col></Col>
      </Row>
      <Timer
        onNewSolve={(solve) => handleNewCaseSolve(solve, currentCase, null)}
        scramble={currentScramble}
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
