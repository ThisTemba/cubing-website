import React from "react";
const ScrambleDisplay = (props) => {
  const displayStyle = {
    fontFamily: "Monospace",
    textAlign: "center",
    fontSize: "30px",
  };
  return (
    <div className="text-center m-3" style={displayStyle}>
      {props.scramble}
    </div>
  );
};

export default ScrambleDisplay;
