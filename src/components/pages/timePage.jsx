import React, { useState, useEffect, useContext } from "react";
import { Button, Container, Col, Row, Card, Table } from "react-bootstrap";
import firebase, {
  UserContext,
  getUserDocRef,
  getMainSessionGroupDocRef,
  setDoc,
} from "../../services/firebase";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

import _ from "lodash";

import {
  getSessionStats,
  newGetSessionStats,
  getSessionGroupStats,
} from "../../utils/sessionStats";
import useLocalStorage from "../../hooks/useLocalStorage";
import useStaticScrambles from "../../hooks/useStaticScrambles";

import Timer from "../common/cubing/timer";
import SolveList from "../common/cubing/solveList";
import DarkModeContext from "../../hooks/useDarkMode";

export default function TimePage() {
  const [session, setSession] = useLocalStorage("session", {
    name: null,
    solves: [],
  });
  const [scramble, nextScramble] = useStaticScrambles();
  const { user } = useContext(UserContext);
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    if (session.name === null) handleNewSession();
  }, []);

  const saveCurrentSession = (session) => {
    getUserDocRef(user)
      .collection("sessions")
      .add(session)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  const newSaveCurrentSession = async (session) => {
    const sessionGroupDocRef = getMainSessionGroupDocRef(user);

    // Save to sessionDoc
    const sessionDocRef = await sessionGroupDocRef
      .collection("sessions")
      .add(session);

    // Read sessionGroupDoc
    let sessionGroup = (await sessionGroupDocRef.get()).data() || {};

    // Prepare Data
    const newSession = _.omit(session, "solves", "timeStamp");
    newSession.id = sessionDocRef.id;
    if (sessionGroup.sessions) {
      sessionGroup.sessions = [...sessionGroup?.sessions, newSession];
    } else sessionGroup.sessions = [newSession];
    const sessionGroupStats = getSessionGroupStats(sessionGroup.sessions);
    sessionGroup = _.merge(sessionGroup, sessionGroupStats);

    // Write to sessionGroupDoc
    setDoc(sessionGroupDocRef, sessionGroup, "Session Group");
  };

  const getNewSession = (solves = []) => {
    const dateTime = new Date();
    return {
      name:
        dateTime.toLocaleDateString() +
        " " +
        dateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: dateTime.toLocaleDateString(),
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      dateTime: dateTime.toString(),
      solves: solves,
    };
  };

  const penalizeSolve = (solve, penalty) => {
    let { durStatic } = solve;
    const map = { DNF: Infinity, "+2": durStatic + 2, "": durStatic };
    return { ...solve, penalty, dur: map[penalty] };
  };

  const handleNewSession = () => {
    const hasSolves = session.solves.length > 0;
    if (hasSolves) {
      const stats = getSessionStats(session);
      const newStats = newGetSessionStats(session);
      saveCurrentSession({ ...session, stats });
      newSaveCurrentSession({ ...session, ...newStats });
    }
    setSession(getNewSession());
    document.activeElement.blur(); // remove focus from new session button
    // because if you don't do this, pressing space afterwards triggers the button
  };

  const handleNewSolve = (solve) => {
    const { solves } = session;
    nextScramble();
    const newSolve = { ...solve, penalty: "", solveNumber: solves.length + 1 };
    if (solves.length === 0) setSession(getNewSession([newSolve]));
    else setSession({ ...session, solves: [...solves, newSolve] });
  };

  const handleDeleteSolve = (dateTime) => {
    let solves = session.solves.filter((s) => s.dateTime !== dateTime);
    solves = solves.map((s, i) => ({ ...s, solveNumber: i + 1 }));
    setSession({ ...session, solves });
  };

  const handlePenalty = (solveDateTime, newPenalty) => {
    let solves = [...session.solves];
    const i = solves.findIndex((s) => s.dateTime === solveDateTime);
    if (solves[i].penalty === newPenalty) newPenalty = "";
    solves[i] = penalizeSolve(solves[i], newPenalty);
    setSession({ ...session, solves });
    document.activeElement.blur();
  };
  const numSolves = session.solves.length;

  const barValue = (start, end, numSolves) => {
    return numSolves < end
      ? numSolves >= start
        ? (numSolves - start) / (end - start)
        : 0
      : 1;
  };

  const data = [
    {
      numSolves: barValue(0, 5, numSolves),
      fill: "#0d6efd",
    },
    {
      numSolves: barValue(5, 12, numSolves),
      fill: "#6610f2",
    },
    {
      numSolves: barValue(12, 25, numSolves),
      fill: "#6f42c1",
    },
    {
      numSolves: barValue(25, 50, numSolves),
      fill: "#d63384",
    },
    {
      numSolves: barValue(50, 100, numSolves),
      fill: "#dc3545",
    },
  ];

  const cardStyles = { height: 300 };

  return (
    <>
      <Container className="text-center">
        <Timer
          onNewSolve={handleNewSolve}
          armingTime={100}
          scramble={scramble}
        />

        {/* <SolveList
          solves={session.solves}
          onDeleteSolve={handleDeleteSolve}
          onPenalty={handlePenalty}
        /> */}
      </Container>
      <Container
        className="text-center"
        style={{
          position: "fixed",
          bottom: "5%",
          left: "50%",
          transform: "translate(-50%)",
        }}
      >
        {user && (
          <h3>
            <Button
              size="sm"
              onClick={handleNewSession}
              disabled={session.solves.length === 0}
            >
              End Session
            </Button>
          </h3>
        )}
        <Row>
          <Col md={3} className="p-0">
            <Card className="m-2" style={cardStyles}>
              <Card.Body>
                <SolveList
                  solves={session.solves}
                  onDeleteSolve={handleDeleteSolve}
                  onPenalty={handlePenalty}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="p-0">
            <Card className="m-2" style={cardStyles}>
              <Card.Body>
                <RadialBarChart
                  width={512}
                  height={450}
                  innerRadius="20%"
                  outerRadius="100%"
                  data={data}
                  startAngle={180}
                  endAngle={0}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 1]}
                    dataKey={"pct"}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    background={{ fill: darkMode ? "#343a40" : "#e9ecef" }}
                    minAngle={15}
                    maxAngle={180}
                    clockWise={true}
                    dataKey="numSolves"
                  />
                </RadialBarChart>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="p-0">
            <Card className="m-2" style={cardStyles}>
              <Card.Body>
                <Table>
                  <tr>
                    <td>1234</td>
                    <td>oyub</td>
                  </tr>
                  <tr>
                    <td>086</td>
                    <td>7tyv</td>
                  </tr>
                  <tr>
                    <td>5f7</td>
                    <td>t</td>
                  </tr>
                  <tr>
                    <td>786</td>
                    <td>f97</td>
                  </tr>
                  <tr>
                    <td>976g</td>
                    <td>7g</td>
                  </tr>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
