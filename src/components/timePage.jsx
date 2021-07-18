import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import paginate from "../utils/paginate";
import Timer from "./common/timer";
import SolveList from "./common/solveList";
import Pagination from "./common/pagination";

export default function TimePage() {
  const [session, setSession] = useState();
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const puzzle = "333";

  useEffect(() => {
    handleNewSession();
  }, []);

  const handleNewSession = () => {
    // save current session to cloud
    console.log(session);

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

  return (
    <div className="container">
      <Button onClick={handleNewSession}>New Session</Button>
      <Timer onNewSolve={handleNewSolve} armingTime={100} />
      <SolveList solves={getSolves(session)} />
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
