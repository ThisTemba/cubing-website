import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { db, useAuthState } from "../../fire";

import paginate from "../../utils/paginate";
import getTimeString from "../../utils/getTimeString";
import { bestAoN, getbestSingle } from "../../utils/averages";
import useLocalStorage from "../../utils/useLocalStorage";
import useStaticScrambles from "../../utils/useStaticScrambles";

import Timer from "../common/cubing/timer";
import SolveList from "../common/cubing/solveList";
import Pagination from "../common/pagination";

export default function TimePage() {
  const [session, setSession] = useLocalStorage("session", {
    name: null,
    solves: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [scramble, nextScramble] = useStaticScrambles();
  const user = useAuthState();
  const pageSize = 10;
  const puzzle = "333";

  useEffect(() => {
    if (!session) handleNewSession();
  }, []);

  const saveCurrentSession = (session) => {
    db.collection("users")
      .doc(user.uid)
      .collection("sessions")
      .add(session)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  const getSessionStats = (session) => {
    if (session.solves.length < 1) return;
    let stats = {};
    const numSolves = session.solves.length;
    const bestSingle = getbestSingle(session.solves);
    if (session.solves.length >= 5) {
      // yes, duplicated code, but izokay!
      const bestAo5 = bestAoN(session.solves, 5);
      stats = { ...stats, bestAo5 };
    }
    if (session.solves.length >= 12) {
      const bestAo12 = bestAoN(session.solves, 12);
      stats = { ...stats, bestAo12 };
    }
    stats = { ...stats, numSolves, bestSingle };
    const sessionWithStats = { ...session, stats };
    return sessionWithStats;
  };

  const getNewSession = () => {
    const dateTime = new Date();
    return {
      name: dateTime.toLocaleDateString() + " " + dateTime.toLocaleTimeString(),
      date: dateTime.toLocaleDateString(),
      dateTime: dateTime,
      puzzle: puzzle,
      solves: [],
    };
  };

  const getFormattedSolves = (session) => {
    if (session) {
      const orderedSolves = [...session.solves].reverse();
      const paginatedSolves = paginate(orderedSolves, currentPage, pageSize);
      return paginatedSolves;
    } else {
      return [];
    }
  };

  const penalizeSolve = (solve, penalty) => {
    let solveTime = solve.solveTime;
    let t = solveTime.timeRaw; // get timeRaw
    const map = {
      DNF: { tStr: "DNF", tSec: t / 1000 },
      "+2": { tStr: getTimeString(t + 2000) + "+", tSec: (t + 2000) / 1000 },
      "": { tStr: getTimeString(t), tSec: t / 1000 },
    };
    solveTime = {
      ...solveTime,
      timeString: map[penalty].tStr,
      timeSeconds: map[penalty].tSec,
    };
    return { ...solve, penalty, solveTime };
  };

  const handleNewSession = () => {
    if (session.solves.length > 0) {
      const currentSession = getSessionStats(session);
      saveCurrentSession(currentSession);
    }
    setSession(getNewSession());
    document.activeElement.blur(); // remove focus from new session button
    // because if you don't do this, pressing space afterwards triggers the button
  };

  const handleNewSolve = (solve) => {
    nextScramble();
    const newSolve = {
      ...solve,
      penalty: "",
      solveNumber: session.solves.length + 1,
    };
    setSession({ ...session, solves: [...session.solves, newSolve] });
  };

  const handleDeleteSolve = (dateTime) => {
    let solves = session.solves.filter((s) => s.dateTime !== dateTime);
    solves = solves.map((s, i) => {
      return { ...s, solveNumber: i + 1 };
    });
    setSession({ ...session, solves });
  };

  const handlePenalty = (solveDateTime, newPenalty) => {
    let solves = [...session.solves];
    const i = solves.findIndex((s) => s.dateTime === solveDateTime);
    if (solves[i].penalty !== newPenalty) {
      solves[i] = penalizeSolve(solves[i], newPenalty);
      setSession({ ...session, solves });
    }
  };

  return (
    <div className="container">
      {user && <Button onClick={handleNewSession}>New Session</Button>}
      <Timer onNewSolve={handleNewSolve} armingTime={100} scramble={scramble} />
      {session && <h3>{"Session: " + session.name}</h3>}
      <SolveList
        solves={getFormattedSolves(session)}
        onDeleteSolve={handleDeleteSolve}
        onPenalty={handlePenalty}
      />
      {session && (
        <Pagination
          itemsCount={session.solves.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={(p) => setCurrentPage(p)}
        />
      )}
    </div>
  );
}
