import React, { useEffect, useState, useMemo } from "react";
import { Button, Card, Col, Row, Container } from "react-bootstrap";
import { useExpanded, useGroupBy, useTable } from "react-table";
import _ from "lodash";
import { useAuthState } from "../../fire";
import Timer from "../common/cubing/timer";
import ReactTable from "../common/reactTable";
import ButtonGroupToggle from "../common/buttonGroupToggle";
import { CaseImage } from "../common/cubing/cubeImage";
import { displayDur } from "../../utils/formatTime";
import { writeCasesToFirebase } from "../../utils/writeCases";
import { getSTM, randomYRot } from "../../utils/algTools";
import balancedRandomIndex from "../../utils/balancedRandom";
import useDarkMode from "../../hooks/useDarkMode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  }, [selectedCases, solves.length]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === " ") event.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
        Header: "Case",
        accessor: "caseId",
        aggregate: (values) => values[0],
        Cell: ({ value }) => "",
        Aggregated: ({ value: id }) => {
          const cas = _.find(selectedCases, ["id", id]);
          return (
            <CaseImage
              case={cas}
              caseSetDetails={caseSetDetails}
              size="65"
              live
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

  let mistakesButtons = [
    { content: <FontAwesomeIcon icon="check" />, id: 0, color: "success" },
    { content: <FontAwesomeIcon icon="minus" />, id: 1, color: "warning" },
    { content: <FontAwesomeIcon icon="times" />, id: 2, color: "danger" },
  ].map((b) => ({ ...b, content: b.content }));

  const hesitationButton = [
    {
      content: <FontAwesomeIcon icon="spinner" />, //<FontAwesomeIcon icon="spinner" />,
      id: "hesitated",
      color: darkMode ? "light" : "dark",
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
    if (user) {
      writeCasesToFirebase(solves, caseIds, caseSetDetails, user);
    }
  };

  const handleDelete = () => {
    setSolves(solves.length === 1 ? [] : _.tail(solves));
  };

  const renderFeedbackCard = (solve) => {
    const initial = typeof solve === "undefined";
    const solveNum = initial ? "#" : solves.length;
    const caseName = initial ? "Case Name" : solve.caseName;
    const cardProps = {
      style: { width: 500 },
      className: "text-center mb-2",
      bg: darkMode ? "" : "light",
    };
    return (
      <div className="d-flex align-items-center justify-content-center">
        <Card {...cardProps}>
          <Card.Body>
            <Card.Title
              className={initial ? "text-muted" : ""}
            >{`${solveNum}. ${caseName} `}</Card.Title>
            <ButtonGroupToggle
              buttons={hesitationButton}
              onSelect={() => handleToggleHesitation()}
              activeId={initial ? null : solve.hesitated ? "hesitated" : ""}
              size="lg"
              disabled={initial}
            />
            <ButtonGroupToggle
              buttons={mistakesButtons}
              onSelect={(id) => handleSelectMistake(id)}
              activeId={initial ? null : solve.mistakes}
              size="lg"
              disabled={initial}
            />
            <Button
              variant="danger"
              size="lg"
              onClick={handleDelete}
              disabled={initial}
            >
              <FontAwesomeIcon icon="trash" />
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  };

  return (
    <>
      <Row>
        <Col className="p-0">
          <Button
            onClick={handleBackToDash}
            variant={darkMode ? "dark" : "secondary"}
            className="m-1"
          >
            <FontAwesomeIcon icon="chevron-left" /> Back to Dashboard
          </Button>
        </Col>
      </Row>
      <Timer
        onNewSolve={(solve) => handleNewCaseSolve(solve, currentCase)}
        scramble={currentScramble}
        armingTime={100}
      />
      {renderFeedbackCard(solves[0])}
      <ReactTable table={table} />
    </>
  );
}
