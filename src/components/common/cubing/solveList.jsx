import React, { useContext, useState, useEffect } from "react";
import { Table, Button, Card } from "react-bootstrap";
import { listAoNs } from "../../../utils/averages";
import { dispDur } from "../../../utils/displayValue";
import useModal from "../../../hooks/useModal";
import DarkModeContext from "../../../hooks/useDarkMode";
import { FaIcon } from "../../../fontAwesome";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import ButtonGroupToggle from "../buttonGroupToggle";

export default function SolveList({ solves, onPenalty, onDeleteSolve }) {
  const [ModalComponent, showModal, unused, setModalContent] = useModal();
  const [selectedSolveDateTime, setSelectedSolveDateTime] = useState(null);
  const penaltyButtons = [
    { label: "None", penalty: "" },
    { label: "+2", penalty: "+2" },
    { label: "DNF", penalty: "DNF" },
  ];
  const penaltyButtons2 = [
    { content: "None", id: "", color: "success" },
    { content: "+2", id: "+2", color: "warning" },
    { content: "DNF", id: "DNF", color: "danger" },
  ];
  const { darkMode } = useContext(DarkModeContext);
  const { xs } = useWindowDimensions();

  useEffect(() => {
    const s = solves.find((s) => s.dateTime === selectedSolveDateTime);
    if (s) {
      const content = {
        title: `Solve ${s?.solveNumber}`,
        body: getModalBody(s),
      };
      setModalContent(content);
    }
  }, [solves]);

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
    const color = darkMode ? "#adadad" : "#343a40";
    //Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
    const options = { hour: "2-digit", minute: "2-digit" };
    return (
      <>
        <Table className="text-center m-0">
          <colgroup>
            <col span="1" style={{ width: "30%" }} />
            <col span="1" style={{ width: "70%" }} />
          </colgroup>
          <tr>
            <th className="align-middle">Solve Time</th>
            <td className="align-middle">
              {dispDur(s.dur) + (s.penalty === "+2" ? "+" : "")}
            </td>
          </tr>
          <tr>
            <th className="align-middle">Scramble</th>
            <td className="align-middle">{s.scramble}</td>
          </tr>
          <tr>
            <th className="align-middle">Time</th>
            <td className="align-middle">
              {dateTime.toLocaleTimeString([], options)}
            </td>
          </tr>
          <tr>
            <th className="align-middle">Penalty</th>
            <td className="align-middle">
              <ButtonGroupToggle
                buttons={penaltyButtons2}
                activeId={s.penalty}
                onSelect={(id) => {
                  onPenalty(s.dateTime, id);
                }}
              ></ButtonGroupToggle>
            </td>
          </tr>
        </Table>

        {/* {penaltyButtons.map((button) => (
          <>
            <Button
              key={button.penalty}
              variant="link"
              size="sm"
              style={{ color }}
              onClick={() => onPenalty(dateTime, button.penalty)}
            >
              {button.label}
            </Button>
          </>
        ))} */}
      </>
    );
  };

  const renderPenaltyButtons = (dateTime) => {
    const color = darkMode ? "#adadad" : "#343a40";
    return (
      <div>
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
      <tr key={s.dur + s.dateTime + s.scramble} className="align-middle">
        <th scope="row" className="align-middle">
          {s.solveNumber + ". "}
        </th>
        <td
          className="align-middle"
          style={{
            cursor: "pointer",
          }}
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
        </td>
        <td className="align-middle">{renderPenaltyButtons(s.dateTime)}</td>
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
