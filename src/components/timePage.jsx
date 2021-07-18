import React, { useState, useEffect } from "react";
import Timer from "./common/timer";
import { Button } from "react-bootstrap";

export default function TimePage() {
  const [session, setSession] = useState();

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

  return (
    <div>
      <h1>Time Page</h1>
      <Timer
        onNewSolve={(solve) => {
          session.solves.push(solve);
        }}
      />
      <Button onClick={handleNewSession}>New Session</Button>
    </div>
  );
}
