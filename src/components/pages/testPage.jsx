import React, { useEffect, useState, useMemo } from "react";
import { Button, Card, Col, Row, Container } from "react-bootstrap";
import { useExpanded, useGroupBy, useTable } from "react-table";
import _ from "lodash";
import Timer from "../common/cubing/timer";
import ReactTable from "../common/reactTable";
import ButtonGroupToggle from "../common/buttonGroupToggle";
import { displayDur } from "../../utils/formatTime";

export default function TestPage(props) {
  const { selectedCases } = props;
  const [currentCase, setCurrentCase] = useState(selectedCases[0]);
  const [currentScramble, setCurrentScramble] = useState("");
  const [solves, setSolves] = useState([]);

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
        aggregate: "count",
        Cell: ({ value }) => JSON.stringify(value),
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

  const handleSelectMistake = (mistakes) => {
    const newSolves = [...solves];
    newSolves[0].mistakes = mistakes;
    setSolves(newSolves);
    document.activeElement.blur();
    // dehover buttons after clicking
  };

  return (
    <Container>
      <Button
        onClick={() => {
          props.history.push("/train");
          props.onDashboard();
        }}
        variant="secondary"
        className="m-1"
      >
        <i className="fa fa-chevron-left" aria-hidden="true"></i> Back to
        Dashboard
      </Button>
      <Timer
        onNewSolve={(solve) => handleNewCaseSolve(solve, currentCase, null)}
        scramble={currentScramble}
        armingTime={100}
      />
      {solves.length > 0 && (
        <Card>
          <Row>
            <Col>
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
