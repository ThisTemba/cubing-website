import React, { useContext, useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";

import { FaIcon } from "../../../fontAwesome";
import { dispDur } from "../../../utils/displayValue";
import useModal from "../../../hooks/useModal";
import DarkModeContext from "../../../hooks/useDarkMode";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import ButtonGroupToggle from "../buttonGroupToggle";
import TimeDisplay from "./timeDisplay";

export default function SolveList({ solves, onPenalty, onDeleteSolve }) {
  const [ModalComponent, showModal, , setModalContent] = useModal();
  const [selectedSolveDateTime, setSelectedSolveDateTime] = useState(null);
  const { darkMode } = useContext(DarkModeContext);
  const { xs } = useWindowDimensions();
  const buttonsColor = darkMode ? "#d3d3d3" : "#212529";

  useEffect(() => {
    const solve = solves.find((s) => s.dateTime === selectedSolveDateTime);
    if (solve) {
      const content = {
        title: `Solve ${solve?.solveNumber}`,
        body: renderModalBody(solve, onPenalty),
      };
      setModalContent(content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solves, renderModalBody, onPenalty, selectedSolveDateTime]);

  const renderSolveListTable = (solves) => {
    const reversedSolves = [...solves].reverse();
    const btnProps = { href: "#", style: { color: buttonsColor } };

    const onClickTime = (s) => {
      setSelectedSolveDateTime(s.dateTime);
      showModal({
        title: `Solve ${s.solveNumber}`,
        body: renderModalBody(s, onPenalty),
      });
      document.activeElement.blur();
    };

    const PlaceholderTable = () => (
      <>
        {(xs ? [3, 2, 1] : [6, 5, 4, 3, 2, 1]).map((n) => (
          <tr style={{ userSelect: "none" }}>
            <th className="align-middle">{n}.</th>
            <td className="align-middle">-</td>
            <td className="align-middle">-</td>
          </tr>
        ))}
      </>
    );

    const noSolves = solves.length === 0;

    return (
      <Table className={"m-0 " + (noSolves ? "text-muted" : "")} borderless>
        <colgroup>
          <col span="1" style={{ width: "33%" }} />
          <col span="1" style={{ width: "33%" }} />
          <col span="1" style={{ width: "33%" }} />
        </colgroup>
        <tbody>
          {!noSolves &&
            reversedSolves.map((s) => (
              <tr
                key={s.dur + s.dateTime + s.scramble}
                className="align-middle"
              >
                <th className="align-middle">{s.solveNumber + "."}</th>
                <td className="align-middle">
                  <a
                    {...btnProps}
                    onClick={(e) => {
                      e.preventDefault(); // hack to prevent href from being followed
                      onClickTime(s);
                    }}
                  >
                    {dispDur(s.dur) + (s.penalty === "+2" ? "+" : "")}
                  </a>
                </td>
                <td className="align-middle">
                  <a
                    {...btnProps}
                    onClick={(e) => {
                      e.preventDefault(); // hack to prevent href from being followed
                      onDeleteSolve(s.dateTime);
                    }}
                  >
                    <FaIcon icon="trash" size="sm" />
                  </a>
                </td>
              </tr>
            ))}
          {noSolves && <PlaceholderTable />}
        </tbody>
      </Table>
    );
  };

  return (
    <>
      <SimpleBar style={{ maxHeight: xs ? 150 : 288 }}>
        {renderSolveListTable(solves)}
      </SimpleBar>
      <ModalComponent />
    </>
  );
}
function renderPenaltyButtons(s, onPenalty) {
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
}

function renderModalBody(s, onPenalty) {
  const timeOptions = { hour: "2-digit", minute: "2-digit" };
  const time = new Date(s.dateTime).toLocaleTimeString([], timeOptions);
  const rows = [
    { label: "Scramble", value: s.scramble },
    { label: "Time", value: time },
    { label: "Penalty", value: renderPenaltyButtons(s, onPenalty) },
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
}
