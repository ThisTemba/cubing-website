import React from "react";
import { getTimeString } from "../../../utils/formatTime";
const TimeDisplay = (props) => {
  let { timeMilliseconds } = props;
  const displayStyle = {
    fontFamily: "Monospace",
    textAlign: "center",
    fontSize: "100px",
    color:
      props.timerState === "arming"
        ? "red"
        : props.timerState === "armed"
        ? "green"
        : "",
  };

  return <h1 style={displayStyle}>{getTimeString(timeMilliseconds)}</h1>;
};

export default TimeDisplay;
