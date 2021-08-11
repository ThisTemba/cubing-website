import React, { useRef, useState, useEffect } from "react";
import TimeDisplay from "./timeDisplay";
import ScrambleDisplay from "./scrambleDisplay";
import useInterval from "../../../hooks/useInterval";

export default function Timer(props) {
  const { scramble, armingTime, onNewSolve } = props;
  const [time, _setTime] = useState(0);
  const [timerState, _setTimerState] = useState("ready");
  const timerRef = useRef();
  const timeoutRef = useRef();
  const timeRef = useRef();
  const onNewSolveRef = useRef(onNewSolve);
  const timerStateRef = useRef(timerState);

  useInterval(() => setTime(time + 10), timerState === "on" ? 10 : null);

  useEffect(() => {
    onNewSolveRef.current = onNewSolve;
  }, [onNewSolve]);

  const setTimerState = (state) => {
    timerStateRef.current = state;
    _setTimerState(state);
  };

  const setTime = (time) => {
    timeRef.current = time;
    _setTime(time);
  };

  const getNewSolve = () => {
    const dur = timeRef.current / 1000;
    const solve = {
      dateTime: new Date().toString(),
      scramble: scramble,
      durStatic: dur,
      dur,
    };
    return solve;
  };

  const handleTouchEnd = (e) => {
    const timerState = timerStateRef.current;
    const cancelling = timerState === "armed";
    const coolingDown = timerState === "cooldown";
    if (cancelling || coolingDown) {
      e.key = " ";
      e.preventDefault();
      handleKeyUp(e);
    }
  };

  const handleKeyUp = (e) => {
    const timerState = timerStateRef.current;
    if (e.key === " ") {
      const timerStateMap = { armed: "on", cooldown: "ready", arming: "ready" };
      setTimerState(timerStateMap[timerState]);
      if (timerState === "arming") {
        clearTimeout(timeoutRef.current);
        setTime(0);
      }
    }
  };

  const handleTouchStart = (e) => {
    const isTouchingTimer = timerRef.current.contains(e.target);
    const timerOn = timerStateRef.current === "on";
    if (isTouchingTimer || timerOn) {
      e.key = " ";
      e.preventDefault();
      handleKeyDown(e);
    }
  };

  const handleKeyDown = (e) => {
    const timerState = timerStateRef.current;
    const onNewSolve = onNewSolveRef.current;
    if (timerState === "on") {
      setTimerState("cooldown");
      onNewSolve(getNewSolve());
    }
    if (e.key === " ") {
      e.preventDefault(); // no scroll
      if (timerState === "ready") {
        setTimerState("arming");
        timeoutRef.current = setTimeout(() => {
          setTimerState("armed");
          setTime(0);
        }, armingTime);
      }
    }
  };

  useEffect(() => {
    const listeners = [
      { type: "touchstart", listener: handleTouchStart },
      { type: "touchend", listener: handleTouchEnd },
      { type: "keyup", listener: handleKeyUp },
      { type: "keydown", listener: handleKeyDown },
    ];

    const addListener = (t, l) => document.addEventListener(t, l);
    const removeListener = (t, l) => document.removeEventListener(t, l);
    listeners.forEach((l) => addListener(l.type, l.listener));
    return () => {
      listeners.forEach((l) => removeListener(l.type, l.listener));
    };
  }, []);

  // Source: https://stackoverflow.com/questions/826782/how-to-disable-text-selection-highlighting
  return (
    <div ref={timerRef} style={{ userSelect: "none" }}>
      <ScrambleDisplay scramble={scramble} />
      <TimeDisplay timeMilliseconds={time} timerState={timerState} />
    </div>
  );
}

Timer.defaultProps = {
  armingTime: 300,
  scramble: "R U R' U'(test scramble)",
  onNewSolve: () => {},
};
