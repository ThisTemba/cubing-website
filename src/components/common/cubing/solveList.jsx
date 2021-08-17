import React from "react";
import Table from "react-bootstrap/Table";
import Pagination from "../pagination";
import paginate from "../../../utils/paginate";
import { listAoNs } from "../../../utils/averages";
import { displayDur } from "../../../utils/formatTime";
import useModal from "../../../hooks/useModal";
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

  const getProcessedSolves = (solves) => {
    if (solves) {
      const durs = solves.map((s) => s.dur);
      const ao5s = listAoNs(durs, 5);
      const ao12s = listAoNs(durs, 12);
      solves = solves.map((s, i) => ({
        ...s,
        ao5: typeof ao5s[i] === "number" ? displayDur(ao5s[i]) : ao5s[i],
        ao12: typeof ao12s[i] === "number" ? displayDur(ao12s[i]) : ao12s[i],
      }));
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
        {`Solve Time: ${displayDur(s.dur)} \n\n`} <br />
        {`Scramble: ${s.scramble}`} <br />
        {`Date: ${dateTime.toLocaleDateString()}`} <br />
        {`Time: ${dateTime.toLocaleTimeString([], options)}`} <br />
        {`Penalty: ${s.penalty || "None"}`}
      </div>
    );
  };

  const renderPenaltyButtons = (dateTime) => {
    return (
      <div>
        {penaltyButtons.map((button) => (
          <button
            key={button.penalty}
            className="btn btn-sm btn-link"
            onClick={() => onPenalty(dateTime, button.penalty)}
          >
            {button.label}
          </button>
        ))}
        <button
          className="btn btn-sm btn-danger"
          onClick={() => onDeleteSolve(dateTime)}
        >
          <FaIcon icon="trash" />
        </button>
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
                  {displayDur(s.dur)}
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
