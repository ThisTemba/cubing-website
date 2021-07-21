import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { db, useAuthState } from "../../fire";

import getTimeString from "../../utils/getTimeString";
import {
  bestAoN,
  getBestSingle,
  getWorstSingle,
  getSessionAverage,
} from "../../utils/averages";
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
  const user = useAuthState();
  const pageSize = 12;
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

  const getSessionWithStats = (session) => {
    const solves = session.solves;
    if (solves.length < 1) return;
    let stats = {};
    const numSolves = solves.length;
    const bestSingle = getBestSingle(solves);
    const worstSingle = getWorstSingle(solves);
    const sessionAverage = getSessionAverage(solves);
    if (solves.length >= 5) {
      // yes, duplicated code, but izokay!
      const bestAo5 = bestAoN(solves, 5);
      stats = { ...stats, bestAo5 };
    }
    if (solves.length >= 12) {
      const bestAo12 = bestAoN(solves, 12);
      stats = { ...stats, bestAo12 };
    }
    stats = { ...stats, numSolves, sessionAverage, bestSingle, worstSingle };
    return { ...session, stats };
  };

  const getNewSession = (solves = []) => {
    const dateTime = new Date();
    return {
      name:
        dateTime.toLocaleDateString() +
        " " +
        dateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: dateTime.toLocaleDateString(),
      dateTime: dateTime.toString(),
      puzzle: puzzle,
      solves: solves,
    };
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
    const hasSolves = session.solves.length > 0;
    if (hasSolves) saveCurrentSession(getSessionWithStats(session));
    setSession(getNewSession());
    document.activeElement.blur(); // remove focus from new session button
    // because if you don't do this, pressing space afterwards triggers the button
  };

  const handleNewSolve = (solve) => {
    const { solves } = session;
    nextScramble();
    const newSolve = {
      ...solve,
      penalty: "",
      solveNumber: solves.length + 1,
    };
    if (solves.length === 0) {
      setSession(getNewSession([...solves, newSolve]));
    } else setSession({ ...session, solves: [...solves, newSolve] });
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
    if (solves[i].penalty === newPenalty) newPenalty = "";
    solves[i] = penalizeSolve(solves[i], newPenalty);
    setSession({ ...session, solves });
  };

  return (
    <div className="container-fluid">
      <Timer onNewSolve={handleNewSolve} armingTime={100} scramble={scramble} />
      {user && session && (
        <h3>
          {"Session: " + session.name + "  "}
          <Button size="sm" onClick={handleNewSession}>
            New Session
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
    </div>
  );
}
