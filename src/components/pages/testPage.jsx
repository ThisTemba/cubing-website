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
  const [solves, setSolves] = useState([]);
  const user = useAuthState();
  const [darkMode] = useDarkMode();

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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === " ") {
        event.preventDefault();
      }
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
      content: <FontAwesomeIcon icon="check" />, //<FontAwesomeIcon icon="spinner" />,
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

  const getScramble = (currentCase) => {
    return randomYRot(_.sample(currentCase.scrambles));
  };

  const handleDelete = () => {
    setSolves(solves.length === 1 ? [] : _.tail(solves));
  };

  return (
    <Container>
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
        scramble={getScramble(currentCase)}
        armingTime={100}
      />
      {solves.length > 0 && (
        <Card>
          <Row>
            <Col className="text-center">
              <strong>{"Solve: " + solves.length + "."}</strong>{" "}
              {"Case: " + solves[0].caseName}{" "}
              <ButtonGroupToggle
                buttons={hesitationButton}
                onSelect={() => handleToggleHesitation()}
                activeId={solves[0].hesitated ? "hesitated" : ""}
                size="lg"
              />
              <ButtonGroupToggle
                buttons={mistakesButtons}
                onSelect={(id) => handleSelectMistake(id)}
                activeId={solves[0] ? solves[0].mistakes : null}
                size="lg"
              />
              <Button variant="danger" size="lg">
                <FontAwesomeIcon icon="trash" />
              </Button>
            </Col>
          </Row>
        </Card>
      )}
      <ReactTable table={table} />
    </Container>
  );
}
