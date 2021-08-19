import React from "react";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import { getTimeString } from "../../../utils/formatTime";
const TimeDisplay = (props) => {
  let { timeMilliseconds, disabled } = props;
  const { xs } = useWindowDimensions();
  const displayStyle = {
    fontFamily: "Monospace",
    textAlign: "center",
    fontSize: "100px",
    padding: xs ? "30px" : "",
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
