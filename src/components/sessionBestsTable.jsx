import React from "react";
import { dispDur } from "../utils/displayValue";
import { Table } from "react-bootstrap";
import { bestAoN, aoLastN } from "../utils/averages";
import _ from "lodash";

export default function SessionBestsTable({ session }) {
  const durs = session.solves.map((s) => s.dur);
  const bests = {
    Single: _.min(durs),
    Ao5: durs.length >= 5 ? bestAoN(durs, 5) : undefined,
    Ao12: durs.length >= 12 ? bestAoN(durs, 12) : undefined,
    Ao50: durs.length >= 50 ? bestAoN(durs, 50) : undefined,
    Ao100: durs.length >= 100 ? bestAoN(durs, 100) : undefined,
  };
  const currents = {
    Single: _.last(durs),
    Ao5: durs.length >= 5 ? aoLastN(durs, 5) : undefined,
    Ao12: durs.length >= 12 ? aoLastN(durs, 12) : undefined,
    Ao50: durs.length >= 50 ? aoLastN(durs, 50) : undefined,
    Ao100: durs.length >= 100 ? aoLastN(durs, 100) : undefined,
  };
  const preRows = ["Single", "Ao5", "Ao12", "Ao50", "Ao100"];
  const rows = preRows.map((value) => ({
    label: value,
    best: dispDur(bests[value]),
    current: dispDur(currents[value]),
  }));
  return (
    <Table
      borderless
      className={session.solves.length === 0 ? "text-muted" : ""}
    >
      <tr>
        <th></th>
        <th>Best</th>
        <th>Current</th>
      </tr>
      {rows.map((row) => (
        <tr>
          <th>{row.label}</th>
          <td>{row.best}</td>
          <td>{row.current}</td>
        </tr>
      ))}
    </Table>
  );
}
