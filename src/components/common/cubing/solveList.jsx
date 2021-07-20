import React from "react";
import Table from "react-bootstrap/Table";
import Pagination from "../pagination";
import paginate from "../../../utils/paginate";
import { listAoNs } from "../../../utils/averages";

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

  const getProcessedSolves = (solves) => {
    if (solves) {
      const ao5s = listAoNs(solves, 5);
      const ao12s = listAoNs(solves, 12);
      solves = solves.map((s, i) => {
        return { ...s, ao5: ao5s[i], ao12: ao12s[i] };
      });
      console.log(solves);
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

  const processedSolves = getProcessedSolves(solves);
  return (
    <div className="row justify-content-center">
      <div className="col" style={{ maxWidth: "800px" }}>
        <Table bordered hover size="sm">
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
            {processedSolves.map(
              ({ solveNumber, solveTime, dateTime, ao5, ao12 }) => (
                <tr key={dateTime} className="align-middle">
                  <th scope="row">{solveNumber + ". "}</th>
                  <td>{solveTime.timeString}</td>
                  <td>{ao5}</td>
                  <td>{ao12}</td>
                  <td>{renderPenaltyButtons(dateTime)}</td>
                </tr>
              )
            )}
          </tbody>
        </Table>
        <Pagination
          itemsCount={solves.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
