import React, { useEffect, useContext } from "react";
import { Button, Container, Col, Row, Card } from "react-bootstrap";
import firebase, {
  UserContext,
  getUserDocRef,
  getMainSessionGroupDocRef,
  setDoc,
} from "../../services/firebase";

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
import SessionBestsTable from "../sessionBestsTable";
import RainbowProgressBar from "../rainbowProgressBar";
import ColCard from "../common/colCard";

export default function TimePage() {
  const [session, setSession] = useLocalStorage("session", {
    name: null,
    solves: [],
  });
  const [scramble, nextScramble] = useStaticScrambles();
  const { user } = useContext(UserContext);

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

  const rainbowStages = [
    { end: 5, color: "#0d6efd" },
    { end: 12, color: "#6610f2" },
    { end: 25, color: "#6f42c1" },
    { end: 50, color: "#d63384" },
    { end: 100, color: "#dc3545" },
  ];

  return (
    <>
      <Container className="text-center">
        <Timer
          onNewSolve={handleNewSolve}
          armingTime={100}
          scramble={scramble}
        />
      </Container>
      <Container
        className="text-center"
        style={{
          position: "fixed",
          bottom: "2%",
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
          <ColCard colProps={{ md: 3 }} cardStyle={{ height: 337 }}>
            <SolveList
              solves={session.solves}
              onDeleteSolve={handleDeleteSolve}
              onPenalty={handlePenalty}
            />
          </ColCard>
          <ColCard colProps={{ md: 6 }} cardStyle={{ height: 337 }}>
            <RainbowProgressBar stages={rainbowStages} value={numSolves} />
          </ColCard>
          <ColCard colProps={{ md: 3 }} cardStyle={{ height: 337 }}>
            <SessionBestsTable session={session} />
          </ColCard>
        </Row>
      </Container>
    </>
  );
}
