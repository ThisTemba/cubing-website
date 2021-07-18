import React from "react";

export default function SolveList(props) {
  const solves = [...props.solves];
  const penaltyButtons = [
    { label: "+2", penalty: "+2" },
    { label: "DNF", penalty: "DNF" },
    { label: "Reset", penalty: "" },
  ];
  return (
    <table class="table table-sm table-bordered">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Time</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {solves.map(({ solveNumber, solveTime, dateTime }) => (
          <tr key={dateTime} className="align-middle">
            <th scope="row">{solveNumber + ". "}</th>
            <td>{solveTime.timeString}</td>
            <td>
              {penaltyButtons.map((button) => (
                <button
                  className="btn btn-sm btn-link"
                  onClick={() => {
                    props.onPenalty(dateTime, button.penalty);
                  }}
                >
                  {button.label}
                </button>
              ))}
              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  props.onDeleteSolve(dateTime);
                }}
              >
                <i className="fa fa-trash" aria-hidden="true"></i>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
