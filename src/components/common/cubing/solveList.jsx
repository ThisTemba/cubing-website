import React, { useContext, useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

import { FaIcon } from "../../../fontAwesome";
import { listAoNs } from "../../../utils/averages";
import { dispDur } from "../../../utils/displayValue";
import useModal from "../../../hooks/useModal";
import DarkModeContext from "../../../hooks/useDarkMode";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import ButtonGroupToggle from "../buttonGroupToggle";
import TimeDisplay from "./timeDisplay";

export default function SolveList({ solves, onPenalty, onDeleteSolve }) {
  const [ModalComponent, showModal, unused, setModalContent] = useModal();
  const [selectedSolveDateTime, setSelectedSolveDateTime] = useState(null);
  const { darkMode } = useContext(DarkModeContext);
  const { xs } = useWindowDimensions();
  const buttonsColor = darkMode ? "#adadad" : "#343a40";

  useEffect(() => {
    const solve = solves.find((s) => s.dateTime === selectedSolveDateTime);
    if (solve) {
      const content = {
        title: `Solve ${solve?.solveNumber}`,
        body: getModalBody(solve),
      };
      setModalContent(content);
    }
  }, [solves]);

  const renderPenaltyButtons = (s) => {
    const penaltyButtons = [
      { content: "None", id: "", color: "success" },
      { content: "+2", id: "+2", color: "warning" },
      { content: "DNF", id: "DNF", color: "danger" },
    ];
    return (
      <ButtonGroupToggle
        buttons={penaltyButtons}
        activeId={s.penalty}
        onSelect={(id) => {
          onPenalty(s.dateTime, id);
        }}
      ></ButtonGroupToggle>
    );
  };

  const getModalBody = (s) => {
    const timeOptions = { hour: "2-digit", minute: "2-digit" };
    const time = new Date(s.dateTime).toLocaleTimeString([], timeOptions);
    const rows = [
      { label: "Scramble", value: s.scramble },
      { label: "Time", value: time },
      { label: "Penalty", value: renderPenaltyButtons(s) },
    ];
    return (
      <>
        <TimeDisplay
          formattedTime={dispDur(s.dur) + (s.penalty === "+2" ? "+" : "")}
          fontSize={100}
        ></TimeDisplay>
        <Table className="text-center m-0">
          <colgroup>
            <col span="1" style={{ width: "30%" }} />
            <col span="1" style={{ width: "70%" }} />
          </colgroup>
          {rows.map((row) => (
            <tr>
              <th className="align-middle">{row.label}</th>
              <td className="align-middle">{row.value}</td>
            </tr>
          ))}
        </Table>
      </>
    );
  };

  const renderSolveListTable = (solves) => {
    return solves.map((s) => (
      <Table className="m-0">
        <tbody>
          <tr key={s.dur + s.dateTime + s.scramble} className="align-middle">
            <th scope="row" className="align-middle">
              {s.solveNumber + ". "}
            </th>
            <td className="align-middle">
              <Button
                className="m-0 p-0 border-0"
                size="sm"
                variant="link"
                style={{ neutralColor: buttonsColor }}
                onClick={() => {
                  setSelectedSolveDateTime(s.dateTime);
                  showModal({
                    title: `Solve ${s.solveNumber}`,
                    body: getModalBody(s),
                  });
                  document.activeElement.blur();
                }}
              >
                {dispDur(s.dur)}
                {s.penalty === "+2" ? "+" : ""}
              </Button>
            </td>
            <td className="align-middle">
              <Button
                className="m-0 p-0 border-0"
                size="sm"
                variant="link"
                style={{ color: buttonsColor }}
                onClick={() => onDeleteSolve(s.dateTime)}
              >
                <FaIcon icon="trash" />
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    ));
  };

  return (
    <>
      <SimpleBar style={{ maxHeight: xs ? 290 : 297, maxWidth: 600 }}>
        {renderSolveListTable([...solves].reverse())}
      </SimpleBar>
      <ModalComponent />
    </>
  );
}
