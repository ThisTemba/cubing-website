import React, { useState, useEffect } from "react";

export default function Timer() {
  const [time, setTime] = useState(0);
  const [timerState, setTimerState] = useState("ready");

  //   useEffect(() => {
  //       if()
  //     setInterval(setTime(time + 10), 10);
  //   }, [timerState]);

  return <h1>{time}</h1>;
}
