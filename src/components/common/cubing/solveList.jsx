import React from "react";
import Table from "react-bootstrap/Table";
import Pagination from "../pagination";
import paginate from "../../../utils/paginate";

export default function SolveList({
  solves,
  onPenalty,
  onDeleteSolve,
  pageSize,
  currentPage,
  onPageChange,
}) {
  const penaltyButtons = [
    { label: "+2", penalty: "+2" },
    { label: "DNF", penalty: "DNF" },
    { label: "Reset", penalty: "" },
  ];

  const getFormattedSolves = (solves) => {
    if (solves) {
      const orderedSolves = [...solves].reverse();
      const paginatedSolves = paginate(orderedSolves, currentPage, pageSize);
      return paginatedSolves;
    } else return [];
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
          <i className="fa fa-trash" aria-hidden="true"></i>
        </button>
      </div>
    );
  };

  const paginatedSolves = getFormattedSolves(solves);
  return (
    <div>
      <Table bordered hover size="sm">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Time</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {paginatedSolves.map(({ solveNumber, solveTime, dateTime }) => (
            <tr key={dateTime} className="align-middle">
              <th scope="row">{solveNumber + ". "}</th>
              <td>{solveTime.timeString}</td>
              <td>{renderPenaltyButtons(dateTime)}</td>
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
    </div>
  );
}
