import React from "react";
import { useEffect, useState } from "react";
import Chart from "react-google-charts";
import { useAuthState, db } from "../../fire";
import Table from "react-bootstrap/Table";
import ListGroup from "react-bootstrap/ListGroup";
import { getSessionAverage } from "../../utils/averages";
import useModal from "../../hooks/useModal";

export default function StatsPage() {
  const [docs, setDocs] = useState(null);
  const [row, setRow] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [ModalComponent, showModal] = useModal();
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
    // console.log(row);
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
        <Table striped bordered size="sm">
          <tbody>
            <tr>
              <td>Total Solves</td>
              <td>{session.stats.numSolves}</td>
            </tr>
            <tr>
              <td>Session Average</td>
              <td>{session.stats.sessionAverage}</td>
            </tr>
            <tr>
              <td>Best Single</td>
              <td>{session.stats.bestSingle}</td>
            </tr>
          </tbody>
        </Table>
        All stats:
        <ListGroup>
          {Object.keys(session.stats).map((k) => (
            <ListGroup.Item>
              {k}: {session.stats[k]}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    );
  };

  return (
    <div>
      <div>
        <Chart
          width={"100%"}
          height={"90vh"}
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
                  showModal({
                    title: `Session Date: ${docs[row].name}`,
                    body: renderModalBody(docs[row]),
                  });
                }
              },
            },
          ]}
        />
        <ModalComponent />
      </div>
    </div>
  );
}
