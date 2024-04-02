import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import ScrambleDisplay from "./scrambleDisplay";

export default function ManualTimer(props) {
  const { scramble, onNewSolve } = props;

  const time = useState(0);
  const [textBoxText, setTextBoxText] = useState("");
  const scrambleRef = useRef(scramble);
  const { xs } = useWindowDimensions();

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        if (textBoxText === "") console.log("Did not enter anything");
        else if (isNaN(textBoxText)) console.log("Did not enter a number");
        else if (getDuration() === -1) console.log("Number is invalid");
        else onNewSolve(getNewSolve());

        setTextBoxText("");
      }
    };

    const getDuration = () => {
      // convert the entered text into time in seconds
      // do not allow anything over an hour
      const enteredNum = parseFloat(textBoxText);
      if (Number.isInteger(enteredNum)) {
        // if it is an integer, pretend it is the time with centiseconds and no punctuation marks
        // e.g. 1234 -> 12.34, 123456 -> 12:34.56
        let left = enteredNum;
        const centiSeconds = left % 100;
        left = Math.floor(left / 100);
        const seconds = left % 100;
        left = Math.floor(left / 100);
        const minutes = left % 100;
        left = Math.floor(left / 100);

        // check that all digits are valid, and that it is not over an hour
        if (seconds >= 60 || minutes >= 60 || left !== 0) return -1;
        return minutes * 60 + seconds + centiSeconds / 100;
      } else {
        // just check that it is not over an hour
        if (enteredNum > 3600) return -1;
        return enteredNum;
      }
    };

    const getNewSolve = () => {
      const dur = getDuration();
      const solve = {
        dateTime: new Date().toString(),
        scramble: scrambleRef.current,
        durStatic: dur,
        dur,
      };
      return solve;
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [onNewSolve, time, textBoxText]);

  // Source: https://stackoverflow.com/questions/826782/how-to-disable-text-selection-highlighting
  return (
    <div style={{ userSelect: "none" }}>
      <ScrambleDisplay scramble={scramble} disabled={false} />
      <Form.Control
        type="text"
        value={textBoxText}
        onChange={(e) => setTextBoxText(e.target.value)}
        style={{
          textAlign: "center",
          fontSize: xs ? "2rem" : "6rem",
          width: "60%",
          margin: "auto",
          marginBottom: "1rem",
        }}
      />
    </div>
  );
}

ManualTimer.defaultProps = {
  disabled: false,
  scramble: "R U R' U'(test scramble)",
  onNewSolve: () => {},
};
