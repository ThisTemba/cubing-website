import React, { useEffect, useState, useMemo } from "react";
import { Button } from "react-bootstrap";
import { Container } from "react-bootstrap";
import Timer from "../common/cubing/timer";
import _ from "lodash";
import { useExpanded, useGroupBy, useTable } from "react-table";
import ReactTable from "../common/reactTable";
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
      mMistakes: true,
      cMistakes: false,
      caseName: c.name,
      alg: c.algs[0],
      dateTime,
    };
    setSolves([...solves, solve]);
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
        Header: "Minor Mistakes",
        accessor: "mMistakes",
        aggregate: "count",
        Cell: ({ value }) => JSON.stringify(value),
      },
      {
        Header: "Critical Mistakes",
        accessor: "cMistakes",
        aggregate: "count",
        Cell: ({ value }) => JSON.stringify(value),
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
      <ReactTable table={table} />
    </Container>
  );
}
