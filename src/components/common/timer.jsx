import React, { useState, useEffect } from "react";

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
    </div>
  );
}
