import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

export default function Timer() {
  const [time, setTime] = useState(0);
  const [timerState, setTimerState] = useState("ready");

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (timerState === "on") {
      var interval = setInterval(() => setTime((t) => t + 10), 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerState]);

  const handleKeyDown = (e) => {
    console.log(e);
  };

  const handleKeyUp = (e) => {
    console.log(e);
  };

  return (
    <div>
      <h1 style={{ fontFamily: "monospace" }}>{time}</h1>
      <h2>{timerState}</h2>
      <Button onClick={() => setTimerState("on")}>Start</Button>
      <Button onClick={() => setTimerState("off")}>Stop</Button>
    </div>
  );
}
