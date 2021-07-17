import React from "react";
const TimeDisplay = (props) => {
  let { timeString } = props;
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

  return <h1 style={displayStyle}>{timeString}</h1>;
};

export default TimeDisplay;
