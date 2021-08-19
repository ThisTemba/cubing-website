import React from "react";
const ScrambleDisplay = (props) => {
  const { scramble, disabled } = props;
  const displayStyle = {
    fontFamily: "Monospace",
    textAlign: "center",
    fontSize: "30px",
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
