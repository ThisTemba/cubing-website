import React, { useContext } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Pagination from "../pagination";
import paginate from "../../../utils/paginate";
import { listAoNs } from "../../../utils/averages";
import { dispDur } from "../../../utils/displayValue";
import useModal from "../../../hooks/useModal";
import DarkModeContext from "../../../hooks/useDarkMode";
import { FaIcon } from "../../../fontAwesome";

export default function SolveList({
  solves,
  onPenalty,
  onDeleteSolve,
  pageSize,
  currentPage,
  onPageChange,
}) {
  const [ModalComponent, showModal] = useModal();
  const penaltyButtons = [
    { label: "+2", penalty: "+2" },
    { label: "DNF", penalty: "DNF" },
    { label: "Reset", penalty: "" },
  ];
  const { darkMode } = useContext(DarkModeContext);

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
      const paginatedSolves = paginate(orderedSolves, currentPage, pageSize);
      return paginatedSolves;
    } else return [];
  };

  const getModalBody = (s) => {
    const dateTime = new Date(s.dateTime);
    //Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
    const options = { hour: "2-digit", minute: "2-digit" };
    return (
      <div className="">
        {`Solve Time: ${dispDur(s.dur)} \n\n`} <br />
        {`Scramble: ${s.scramble}`} <br />
        {`Date: ${dateTime.toLocaleDateString()}`} <br />
        {`Time: ${dateTime.toLocaleTimeString([], options)}`} <br />
        {`Penalty: ${s.penalty || "None"}`}
      </div>
    );
  };

  const renderPenaltyButtons = (dateTime) => {
    const color = darkMode ? "#adadad" : "#343a40";
    return (
      <div>
        {penaltyButtons.map((button) => (
          <Button
            key={button.penalty}
            variant="link"
            size="sm"
            style={{ color }}
            onClick={() => onPenalty(dateTime, button.penalty)}
          >
            {button.label}
          </Button>
        ))}
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

  const processedSolves = getProcessedSolves(solves);
  return (
    <div className="row justify-content-center">
      <div className="col" style={{ maxWidth: "800px" }}>
        <Table bordered size="sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Time</th>
              <th scope="col">ao5</th>
              <th scope="col">ao12</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {processedSolves.map((s) => (
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
                <td>{s.ao5}</td>
                <td>{s.ao12}</td>
                <td>{renderPenaltyButtons(s.dateTime)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination
          itemsCount={solves.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
        <ModalComponent />
      </div>
    </div>
  );
}
