import React, { useContext } from "react";
import { Table, Button, Card } from "react-bootstrap";
import { listAoNs } from "../../../utils/averages";
import { dispDur } from "../../../utils/displayValue";
import useModal from "../../../hooks/useModal";
import DarkModeContext from "../../../hooks/useDarkMode";
import { FaIcon } from "../../../fontAwesome";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import useWindowDimensions from "../../../hooks/useWindowDimensions";

export default function SolveList({ solves, onPenalty, onDeleteSolve }) {
  const [ModalComponent, showModal] = useModal();
  const penaltyButtons = [
    { label: "+2", penalty: "+2" },
    { label: "DNF", penalty: "DNF" },
    { label: "Reset", penalty: "" },
  ];
  const { darkMode } = useContext(DarkModeContext);
  const { xs } = useWindowDimensions();

  const getProcessedSolves = (solves) => {
    if (solves) {
      const durs = solves.map((s) => s.dur);
      const ao5s = listAoNs(durs, 5);
      const ao12s = listAoNs(durs, 12);
      solves = solves.map((s, i) => {
        const ao5 = dispDur(ao5s[i]);
        const ao12 = dispDur(ao12s[i]);
        return { ...s, ao5, ao12 };
      });
      const orderedSolves = [...solves].reverse();
      return orderedSolves;
    } else return [];
  };

  const getModalBody = (s) => {
    const dateTime = new Date(s.dateTime);
    //Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
    const options = { hour: "2-digit", minute: "2-digit" };
    return (
      <>
        {`Solve Time: ${dispDur(s.dur)} \n\n`} <br />
        {`Scramble: ${s.scramble}`} <br />
        {`Date: ${dateTime.toLocaleDateString()}`} <br />
        {`Time: ${dateTime.toLocaleTimeString([], options)}`} <br />
        {`Penalty: ${s.penalty || "None"}`}
      </>
    );
  };

  const renderPenaltyButtons = (dateTime) => {
    const color = darkMode ? "#adadad" : "#343a40";
    return (
      <div>
        {/* {penaltyButtons.map((button) => (
          <Button
            key={button.penalty}
            variant="link"
            size="sm"
            style={{ color }}
            onClick={() => onPenalty(dateTime, button.penalty)}
          >
            {button.label}
          </Button>
        ))} */}
        <Button
          size="sm"
          variant="link"
          style={{ color }}
          onClick={() => onDeleteSolve(dateTime)}
        >
          <FaIcon icon="trash" />
        </Button>
      </div>
    );
  };

  const renderTableBody = (solves) => {
    return solves.map((s) => (
      <tr key={s.dateTime} className="align-middle">
        <th scope="row">{s.solveNumber + ". "}</th>
        <td
          className="hover-shadow"
          style={{ cursor: "pointer" }}
          onClick={() => {
            showModal({
              title: `Solve ${s.solveNumber}`,
              body: getModalBody(s),
            });
          }}
        >
          {dispDur(s.dur)}
          {s.penalty === "+2" ? "+" : ""}
        </td>
        {/* <td>{s.ao5}</td> */}
        {/* <td>{s.ao12}</td> */}
        <td>{renderPenaltyButtons(s.dateTime)}</td>
      </tr>
    ));
  };

  return (
    <>
      <SimpleBar style={{ maxHeight: xs ? 290 : 260, maxWidth: 600 }}>
        <Table size="sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Time</th>
              {/* <th scope="col">Ao5</th> */}
              {/* <th scope="col">Ao12</th> */}
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>{renderTableBody(getProcessedSolves(solves))}</tbody>
        </Table>
      </SimpleBar>
      <ModalComponent />
    </>
  );
}
