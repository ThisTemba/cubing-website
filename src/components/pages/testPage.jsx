import React, { useEffect, useState, useMemo, useRef } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useTable } from "react-table";
import { FaIcon } from "../../fontAwesome";
import _ from "lodash";
import { useAuthState } from "../../fire";
import Timer from "../common/cubing/timer";
import ReactTable from "../common/reactTable";
import CaseImage from "../common/cubing/cubeImage";
import FeedbackCard from "../feedbackCard";
import { dispDur } from "../../utils/displayValue";
import { writeCasesToFirebase } from "../../utils/writeCases";
import { getSTM, randomYRot } from "../../utils/algTools";
import balancedRandomIndex from "../../utils/balancedRandom";
import useDarkMode from "../../hooks/useDarkMode";
import useWindowDimensions from "../../hooks/useWindowDimensions";

export default function TestPage(props) {
  const { selectedCases, caseSetDetails } = props;
  const [currentCase, setCurrentCase] = useState(selectedCases[0]);
  const [currentScramble, setCurrentScramble] = useState(
    selectedCases[0].scrambles[0]
  );
  const [solves, setSolves] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const solvesRef = useRef();
  const userRef = useRef();
  const [darkMode] = useDarkMode();
  const user = useAuthState();
  const { xs } = useWindowDimensions();

  useEffect(() => {
    nextCaseAndScramble();
  }, [selectedCases, solves.length]);

  useEffect(() => {
    solvesRef.current = solves;
    userRef.current = user;
  }, [solves, user]);

  useEffect(() => {
    return () => {
      props.onDashboard();
      saveData(solvesRef.current, userRef.current);
    };
  }, []);

  const saveData = (solvesWithScrambles, user) => {
    const solves = solvesWithScrambles.map((s) => _.omit(s, "scramble"));
    const caseIds = _.uniqBy(solves, "caseId").map((c) => c.caseId);
    if (user) {
      writeCasesToFirebase(solves, caseIds, caseSetDetails, user);
    }
  };

  const nextCaseAndScramble = () => {
    const counts = selectedCases.map((c) => {
      if (solves.length) {
        const count = _.countBy(solves, "caseId")[c.id];
        return typeof count !== "undefined" ? count : 0;
      } else return 0;
    });
    const index = balancedRandomIndex(counts);
    const nextCase = selectedCases[index];

    const caseSet = caseSetDetails.name;
    const doNotRotate = caseSet === "ttll" || caseSet === "tsle";
    const nextScramble = doNotRotate
      ? _.sample(nextCase.scrambles)
      : randomYRot(_.sample(nextCase.scrambles));
    setCurrentCase(nextCase);
    setCurrentScramble(nextScramble);
  };

  const columns = useMemo(
    () => [
      {
        Header: "#",
        id: "row",
        Cell: ({ row }) => {
          const num = solves.length - row.index;
          return num + ".";
        },
      },
      {
        Header: "Name",
        accessor: "caseName",
      },
      {
        Header: "Case",
        accessor: "caseId",
        aggregate: (values) => values[0],
        Cell: ({ value: id }) => {
          const cas = _.find(selectedCases, ["id", id]);
          return (
            <CaseImage
              alg={cas.alg}
              caseSetDetails={caseSetDetails}
              size={xs ? "40" : "60"}
            />
          );
        },
      },
      {
        Header: "Time",
        accessor: "dur",
        aggregate: "average",
        Cell: ({ value }) => dispDur(value),
      },
      {
        Header: <FaIcon icon="spinner" />,
        accessor: "hesitated",
        aggregate: (bools) => bools.filter(Boolean).length / bools.length,
        Cell: ({ value }) => (value ? <FaIcon icon="spinner" /> : ""),
        Aggregated: ({ value }) => _.round(value, 2),
      },
      {
        Header: <FaIcon icon="check" />,
        id: "none",
        accessor: "mistakes",
        aggregate: (vs) => vs.filter((v) => v === 0).length / vs.length,
        Cell: ({ value }) => (value === 0 ? <FaIcon icon="check" /> : ""),
        Aggregated: ({ value }) => _.round(value, 2),
      },
      {
        Header: <FaIcon icon="minus" />,
        id: "minor",
        accessor: "mistakes",
        aggregate: (vs) => vs.filter((v) => v === 1).length / vs.length,
        Cell: ({ value }) => (value === 1 ? <FaIcon icon="minus" /> : ""),
        Aggregated: ({ value }) => _.round(value, 2),
      },
      {
        Header: <FaIcon icon="times" />,
        id: "critical",
        accessor: "mistakes",
        aggregate: (vs) => vs.filter((v) => v === 2).length / vs.length,
        Cell: ({ value }) => (value === 2 ? <FaIcon icon="times" /> : ""),
        Aggregated: ({ value }) => _.round(value, 2),
      },
    ],
    [solves, xs]
  );
  // const data = useMemo(() => solves, []);
  const data = solves;
  const table = useTable({ columns, data });

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
      scramble: solve.scramble,
    };
    // latest solve at solves[0]
    setSolves([solve, ...solves]);
  };

  const handlePrevious = () => {
    if (currentIndex !== solves.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentScramble(solves[currentIndex].scramble);
    }
  };

  const handleNext = () => {
    if (currentIndex !== 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentScramble(solves[currentIndex].scramble);
    } else {
      nextCaseAndScramble();
    }
    document.activeElement.blur();
  };

  const handleBackToDash = () => props.history.push("/train");
  // TODO: if not logged in, tell them that their data won't be saved

  const secondary = darkMode ? "dark" : "secondary";
  const lastSolveTime = solves.length ? solves[0].dur : 0;
  const initTime = lastSolveTime;

  return (
    <>
      <Row>
        <Col className="p-0">
          <Button
            onClick={handleBackToDash}
            variant={secondary}
            className="m-1"
          >
            <FaIcon icon="chevron-left" /> Back to Dashboard
          </Button>
        </Col>
        <Col className="justify-content-end d-flex p-0">
          <Button
            className="m-1 pl-3 pr-3"
            variant={secondary}
            size="sm"
            onClick={handlePrevious}
            disabled={solves.length === 0 || currentIndex === solves.length - 1}
          >
            <FaIcon icon="backward" />
          </Button>
          <Button
            className="m-1 pl-3 pr-3"
            variant={secondary}
            size="sm"
            onClick={handleNext}
          >
            <FaIcon icon="forward" />
          </Button>
        </Col>
      </Row>
      <Timer
        onNewSolve={(solve) => handleNewCaseSolve(solve, currentCase)}
        scramble={currentScramble}
        armingTime={100}
        initTime={initTime}
      />
      <FeedbackCard
        currentIndex={currentIndex}
        solves={solves}
        setSolves={setSolves}
      />
      <div className="d-flex justify-content-center">
        <ReactTable
          table={table}
          size={xs ? "sm" : ""}
          style={{ width: xs ? 500 : 700 }}
          responsive={false}
        />
      </div>
    </>
  );
}
