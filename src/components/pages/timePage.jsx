import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { db, useAuthState } from "../../fire";

import paginate from "../../utils/paginate";
import getTimeString from "../../utils/getTimeString";
import { bestAoN, getbestSingle } from "../../utils/averages";
import useLocalStorage from "../../utils/useLocalStorage";

import scrambles from "../../data/scrambles";
import Timer from "../common/cubing/timer";
import SolveList from "../common/cubing/solveList";
import Pagination from "../common/pagination";

export default function TimePage() {
  const [session, setSession] = useLocalStorage("session", null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scramble, nextScramble] = useScrambles();
  const user = useAuthState();
  const pageSize = 10;

  const puzzle = "333";

  useEffect(() => {
    if (!session) handleNewSession();
  }, []);

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

  const handleNewSession = () => {
    if (session.solves.length > 0) {
      const currentSession = getSessionStats(session);
      saveCurrentSession(currentSession);
    }

    const dateTime = new Date();
    setSession({
      name: dateTime.toLocaleDateString() + " " + dateTime.toLocaleTimeString(),
      date: dateTime.toLocaleDateString(),
      dateTime: dateTime,
      puzzle: puzzle,
      solves: [],
    });

    document.activeElement.blur(); // remove focus from new session button
    // because if you don't do this, pressing space afterwards triggers the button
  };

  const getSolves = (session) => {
    if (session) {
      const orderedSolves = [...session.solves].reverse();
      const paginatedSolves = paginate(orderedSolves, currentPage, pageSize);
      return paginatedSolves;
    } else {
      return [];
    }
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
    let newSolves = session.solves.filter((s) => s.dateTime !== dateTime);
    newSolves = newSolves.map((s, i) => {
      return { ...s, solveNumber: i + 1 };
    });
    setSession({ ...session, solves: newSolves });
  };

  const handlePenalty = (solveDateTime, newPenalty) => {
    let newSolves = [...session.solves];
    const index = newSolves.findIndex((s) => s.dateTime === solveDateTime);
    let oldPenalty = newSolves[index].penalty;
    if (oldPenalty !== newPenalty) {
      let newSolveTime = newSolves[index].solveTime; // init newSolveTime
      let timeRaw = newSolveTime.timeRaw; // get timeRaw
      switch (newPenalty) {
        case "DNF":
          newSolveTime.timeString = "DNF";
          newSolveTime.timeSeconds = timeRaw / 1000;
          break;
        case "+2":
          newSolveTime.timeString = getTimeString(timeRaw + 2000) + "+";
          newSolveTime.timeSeconds = (timeRaw + 2000) / 1000;
          break;
        case "":
          newSolveTime.timeString = getTimeString(timeRaw);
          newSolveTime.timeSeconds = timeRaw / 1000;
          break;
        default:
      }
      newSolves[index].solveTime = newSolveTime;
      newSolves[index].penalty = newPenalty;
      setSession({ ...session, solves: newSolves });
    }
  };

  return (
    <div className="container">
      <Button onClick={handleNewSession}>New Session</Button>
      <Button onClick={() => getSessionStats(session)}>Session Stats</Button>
      <Timer onNewSolve={handleNewSolve} armingTime={100} scramble={scramble} />
      <h3>{"Session: " + session.name}</h3>
      <SolveList
        solves={getSolves(session)}
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

const useScrambles = () => {
  const [index, setIndex] = useState(
    Math.floor(Math.random() * scrambles.length)
  );
  const nextScramble = () => {
    const newIndex = index + 1 < scrambles.length ? index + 1 : 0;
    setIndex(newIndex);
  };
  return [scrambles[index], nextScramble];
};
