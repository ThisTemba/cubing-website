import React from "react";
import { useEffect, useState } from "react";
import Chart from "react-google-charts";
import { useAuthState, db } from "../../fire";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { expressionStatement } from "@babel/types";
import { getSessionAverage } from "../../utils/averages";

export default function StatsPage() {
  const [show, setShow] = useState(false);
  const [docs, setDocs] = useState(null);
  const [row, setRow] = useState(null);
  const [chartData, setChartData] = useState([]);
  const user = useAuthState();
  useEffect(() => {
    if (user) {
      readSessions((docs) => setDocs(docs));
    }
  }, [user]);

  useEffect(() => {
    if (docs) getChartData(docs);
  }, [docs]);

  useEffect(() => {
    console.log(row);
  }, [row]);

  const readSessions = (callback) => {
    db.collection("users")
      .doc(user.uid)
      .collection("sessions")
      .get()
      .then((querySnapshot) => {
        let docs = querySnapshot.docs;
        docs = docs.map((d) => d.data());
        callback(docs);
      });
  };

  const getChartData = (docs) => {
    let data = docs.map((d) => [
      d.name,
      getDate(d.dateTime),
      d.stats.sessionAverage, // sessions with an average of DNF will not appear
      d.puzzle,
      d.stats.numSolves,
    ]);
    data = [
      ["name", "dateTime", "session average", "puzzle", "number of solves"],
      ...data,
    ];
    setChartData(data);
  };

  const getDate = (dateString) => {
    let date = new Date();
    date.setTime(Date.parse(dateString));
    return date;
  };

  const renderModalBody = (session) => {
    console.log("avg:", getSessionAverage(session.solves));

    return (
      <div>
        Stats:
        <ul>
          {Object.keys(session.stats).map((k) => (
            <li key={k}>
              {k}: {session.stats[k]}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <h1>Stats Page</h1>
      <div>
        <Chart
          width={"100%"}
          height={"80vh"}
          chartType="BubbleChart"
          loader={<div>Loading Chart</div>}
          data={chartData}
          options={{
            title: "Session Average vs Session Date",
            vAxis: { title: "Session Average" },
            hAxis: { title: "Date" },
            bubble: { textStyle: { color: "none" } },
            tooltip: {
              trigger: "none",
            },
          }}
          rootProps={{ "data-testid": "1" }}
          chartEvents={[
            {
              eventName: "select",
              callback: ({ chartWrapper }) => {
                const chart = chartWrapper.getChart();
                const selection = chart.getSelection();
                if (selection.length === 1) {
                  const [selectedItem] = selection;
                  const row = selectedItem.row;
                  const session = docs[row];
                  console.log(session);
                  setRow(row);
                  setShow(true);
                }
                // console.log(selection);
              },
            },
          ]}
        />
        {docs && row !== null && (
          <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{`Session Date: ${docs[row].date}`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{renderModalBody(docs[row])}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShow(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
}
