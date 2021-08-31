import React from "react";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
const ScrambleDisplay = (props) => {
  const { scramble, disabled } = props;
  const { xs } = useWindowDimensions();
  const displayStyle = {
    fontFamily: "Monospace",
    textAlign: "center",
    fontSize: xs ? "24px" : "30px",
  };
  const disabledText = disabled ? " text-muted" : "";
  const className = "text-center m-3" + disabledText;
  return (
    <div className={className} style={displayStyle}>
      {scramble}
    </div>
  );
};

export default ScrambleDisplay;
