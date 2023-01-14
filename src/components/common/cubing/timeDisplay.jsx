import React from "react";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import { getTimeString } from "../../../utils/formatTime";
const TimeDisplay = (props) => {
  let { timeMilliseconds, disabled, formattedTime, fontSize } = props;
  const { xs } = useWindowDimensions();
  const displayStyle = {
    fontFamily: "Monospace",
    textAlign: "center",
    paddingTop: xs ? "30px" : "",
    fontSize: fontSize ? fontSize : xs ? "21vw" : 130,
  };
  const className =
    props.timerState === "arming"
      ? "text-danger"
      : props.timerState === "armed"
      ? "text-success"
      : disabled
      ? "text-muted"
      : "";

  const valueToDisplay =
    typeof timeMilliseconds !== "undefined"
      ? getTimeString(timeMilliseconds)
      : typeof formattedTime !== "undefined"
      ? formattedTime
      : "";

  return (
    <h1 style={displayStyle} className={className}>
      {valueToDisplay}
    </h1>
  );
};

export default TimeDisplay;
