import React, { useEffect, useState, useContext } from "react";
import Table from "react-bootstrap/Table";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import Chart from "react-google-charts";
import { UserContext, getUserDocRef } from "../../services/firebase";
import { getSessionAverage } from "../../utils/averages";
import { dispDur } from "../../utils/displayValue";
import useModal from "../../hooks/useModal";
import { Link } from "react-router-dom";

export default function StatsPage() {
  const [docs, setDocs] = useState();
  const [row, setRow] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [ModalComponent, showModal, hideModal] = useModal();
  const [ModalComponent1, showModal1, hideModal1] = useModal();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};
    const userLoading = typeof user === "undefined";
    if (!userLoading) {
      if (user) {
        unsubscribe = readSessions((docs) => {
          setDocs(docs);
          getChartData(docs);
          console.log("read db");
        });
      } else setDocs(null);
    }
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    const userLoading = typeof user === "undefined";
    const docsLoading = typeof docs === "undefined";
    const statsLoading = userLoading || docsLoading;
    setLoading(statsLoading);
  }, [user, docs]);

  const readSessions = (callback) => {
    getUserDocRef(user)
      .collection("sessions")
      .get()
      .then((querySnapshot) => {
        let docs = querySnapshot.docs;
        docs = docs.map((d) => {
          const sessionWithId = { id: d.id, ...d.data() };
          return sessionWithId;
        });
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
              <td>{dispDur(session.stats.sessionAverage)}</td>
            </tr>
            <tr>
              <td>Best Single</td>
              <td>{dispDur(session.stats.bestSingle)}</td>
            </tr>
          </tbody>
        </Table>
        All stats:
        <ListGroup>
          {Object.keys(session.stats).map((k) => (
            <ListGroup.Item key={k}>
              {k}: {session.stats[k]}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    );
  };

  const deleteSession = (id) => {
    getUserDocRef(user)
      .collection("sessions")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        hideModal();
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  const renderSessionModal = (session) => {
    showModal({
      title: `Session Date: ${session.name}`,
      body: renderModalBody(session),
      footer: (
        <Button
          variant="danger"
          onClick={() => {
            hideModal();
            showModal1({
              title: "Are you sure?",
              body: "This will permanently delete this session (you may have to refresh the page to see changes)",
              footer: (
                <Button
                  variant="danger"
                  onClick={() => {
                    hideModal1();
                    deleteSession(session.id);
                  }}
                >
                  Permanently Delete Session
                </Button>
              ),
            });
          }}
        >
          Delete Session
        </Button>
      ),
    });
  };

  return (
    <Container fluid className="text-center">
      {chartData.length >= 2 && (
        <Chart
          width={"100%"}
          height={"90vh"}
          chartType="BubbleChart"
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
                  renderSessionModal(session);
                }
              },
            },
          ]}
        />
      )}
      {chartData.length <= 1 && !loading && (
        <Jumbotron>
          <h1>{user ? "No Data Available" : "Log in Required"}</h1>
          <p>
            {user
              ? "It seems like you haven't recorded any solves yet. Head over to the Time page and..."
              : "You need to be logged in to track and anaylze your solves"}
          </p>
          {user ? (
            <Button variant="primary" as={Link} to="/time">
              Get Solving!
            </Button>
          ) : (
            <div>
              <Button as={Link} to="/signup" className="m-1" variant="primary">
                Sign Up
              </Button>
              <Button as={Link} to="/login" className="m-1" variant="secondary">
                Log In
              </Button>
            </div>
          )}
        </Jumbotron>
      )}
      <ModalComponent />
      <ModalComponent1 />
    </Container>
  );
}
