import React from "react";
import { getTimeString } from "../../../utils/formatTime";
const TimeDisplay = (props) => {
  let { timeMilliseconds, disabled } = props;
  const displayStyle = {
    fontFamily: "Monospace",
    textAlign: "center",
    fontSize: "100px",
  };
  const className =
    props.timerState === "arming"
      ? "text-danger"
      : props.timerState === "armed"
      ? "text-success"
      : disabled
      ? "text-muted"
      : "";

  return (
    <h1 style={displayStyle} className={className}>
      {getTimeString(timeMilliseconds)}
    </h1>
  );
};

export default TimeDisplay;
