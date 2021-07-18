import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import paginate from "../../utils/paginate";
import getTimeString from "../../utils/getTimeString";
import Timer from "../common/cubing/timer";
import SolveList from "../common/cubing/solveList";
import Pagination from "../common/pagination";
import useLocalStorage from "../../utils/useLocalStorage";
import { aoN } from "../../utils/averages";

export default function TimePage() {
  const [session, setSession] = useLocalStorage("session", null);
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const puzzle = "333";

  useEffect(() => {
    if (!session) handleNewSession();
  }, []);

  const getSessionStats = (session) => {
    const times = session.solves.map((s) => s.solveTime.timeSeconds);
    const numSolves = times.length;
    const res = { ...session, numSolves };
    console.log(aoN(session.solves, 23));
    return res;
  };

  const handleNewSession = () => {
    console.log(getSessionStats(session));

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
      <Timer onNewSolve={handleNewSolve} armingTime={100} />
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
