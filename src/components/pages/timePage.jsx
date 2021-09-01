import React, { useState, useEffect, useContext } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
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

export default function TimePage() {
  const [session, setSession] = useLocalStorage("session", {
    name: null,
    solves: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [scramble, nextScramble] = useStaticScrambles();
  const { user } = useContext(UserContext);
  const pageSize = 8;

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

  return (
    <Container fluid className="text-center">
      <Timer onNewSolve={handleNewSolve} armingTime={100} scramble={scramble} />
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
      <SolveList
        solves={session.solves}
        onDeleteSolve={handleDeleteSolve}
        onPenalty={handlePenalty}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={(p) => setCurrentPage(p)}
      />
    </Container>
  );
}
