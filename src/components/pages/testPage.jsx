import React, { useEffect, useState, useMemo } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useExpanded, useGroupBy, useTable } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { useAuthState } from "../../fire";
import Timer from "../common/cubing/timer";
import ReactTable from "../common/reactTable";
import CaseImage from "../common/cubing/cubeImage";
import FeedbackCard from "../feedbackCard";
import { displayDur } from "../../utils/formatTime";
import { writeCasesToFirebase } from "../../utils/writeCases";
import { getSTM, randomYRot } from "../../utils/algTools";
import balancedRandomIndex from "../../utils/balancedRandom";
import useDarkMode from "../../hooks/useDarkMode";

export default function TestPage(props) {
  const { selectedCases, caseSetDetails } = props;
  const [currentCase, setCurrentCase] = useState(selectedCases[0]);
  const [currentScramble, setCurrentScramble] = useState(
    selectedCases[0].scrambles[0]
  );
  const [solves, setSolves] = useState([]);
  const [darkMode] = useDarkMode();
  const user = useAuthState();

  useEffect(() => {
    nextCaseAndScramble();
  }, [selectedCases, solves.length]);

  const nextCaseAndScramble = () => {
    const counts = selectedCases.map((c) => {
      if (solves.length) {
        const count = _.countBy(solves, "caseId")[c.id];
        return typeof count !== "undefined" ? count : 0;
      } else return 0;
    });
    const index = balancedRandomIndex(counts);
    const nextCase = selectedCases[index];
    const nextScramble = randomYRot(_.sample(nextCase.scrambles));
    setCurrentCase(nextCase);
    setCurrentScramble(nextScramble);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "caseName",
      },
      {
        Header: "Case",
        accessor: "caseId",
        aggregate: (values) => values[0],
        Cell: () => "",
        Aggregated: ({ value: id }) => {
          const cas = _.find(selectedCases, ["id", id]);
          return (
            <CaseImage
              alg={cas.alg}
              caseSetDetails={caseSetDetails}
              size="65"
            />
          );
        },
      },
      {
        Header: "Time",
        accessor: "dur",
        aggregate: "average",
        Cell: ({ value }) => displayDur(value),
      },
      {
        Header: <FontAwesomeIcon icon="spinner" />,
        accessor: "hesitated",
        aggregate: (bools) => bools.filter(Boolean).length / bools.length,
        Cell: ({ value }) => (value ? <FontAwesomeIcon icon="spinner" /> : ""),
        Aggregated: ({ value }) => _.round(value, 2),
      },
      {
        Header: <FontAwesomeIcon icon="check" />,
        id: "none",
        accessor: "mistakes",
        aggregate: (vs) => vs.filter((v) => v === 0).length / vs.length,
        Cell: ({ value }) =>
          value === 0 ? <FontAwesomeIcon icon="check" /> : "",
        Aggregated: ({ value }) => _.round(value, 2),
      },
      {
        Header: <FontAwesomeIcon icon="minus" />,
        id: "minor",
        accessor: "mistakes",
        aggregate: (vs) => vs.filter((v) => v === 1).length / vs.length,
        Cell: ({ value }) =>
          value === 1 ? <FontAwesomeIcon icon="minus" /> : "",
        Aggregated: ({ value }) => _.round(value, 2),
      },
      {
        Header: <FontAwesomeIcon icon="times" />,
        id: "critical",
        accessor: "mistakes",
        aggregate: (vs) => vs.filter((v) => v === 2).length / vs.length,
        Cell: ({ value }) =>
          value === 2 ? <FontAwesomeIcon icon="times" /> : "",
        Aggregated: ({ value }) => _.round(value, 2),
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
    // latest solve at solves[0]
    setSolves([solve, ...solves]);
  };

  const handleBackToDash = () => {
    props.history.push("/train");
    // TODO: if not logged in, tell them that their data won't be saved
    props.onDashboard();
    const caseIds = _.uniqBy(solves, "caseId").map((c) => c.caseId);
    if (user) {
      writeCasesToFirebase(solves, caseIds, caseSetDetails, user);
    }
  };

  const secondary = darkMode ? "dark" : "secondary";

  return (
    <>
      <Row>
        <Col className="p-0">
          <Button
            onClick={handleBackToDash}
            variant={secondary}
            className="m-1"
          >
            <FontAwesomeIcon icon="chevron-left" /> Back to Dashboard
          </Button>
        </Col>
        <Col className="justify-content-end d-flex p-0">
          <Button
            className="m-1 pl-3 pr-3"
            variant={secondary}
            size="sm"
            onClick={nextCaseAndScramble}
          >
            <FontAwesomeIcon icon="forward" />
          </Button>
        </Col>
      </Row>
      <Timer
        onNewSolve={(solve) => handleNewCaseSolve(solve, currentCase)}
        scramble={currentScramble}
        armingTime={100}
      />
      <FeedbackCard
        currentSolve={solves[0]}
        solves={solves}
        setSolves={setSolves}
      />
      <ReactTable table={table} />
    </>
  );
}
