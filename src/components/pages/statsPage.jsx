import React, { useEffect, useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import { UserContext, getUserDocRef } from "../../services/firebase";
import { Link } from "react-router-dom";

export default function StatsPage() {
  const { user } = useContext(UserContext);
  const [docs, setDocs] = useState();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = () => {};
    if (user) {
      unsubscribe = readSessions((docs) => {
        setDocs(docs);
        getChartData(docs);
      });
    }
    const userLoading = typeof user === "undefined";
    const docsLoading = typeof docs === "undefined";
    const statsLoading = userLoading || docsLoading;
    setLoading(statsLoading);
    return unsubscribe;
  }, [user, docs]);

  const readSessions = (callback) => {
    const unsubscribe = getUserDocRef(user)
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
    return unsubscribe;
  };

  const getChartData = (docs) => {
    let data = docs.map((d) => ({
      name: d.name,
      dateTime: d.dateTime,
      sessionAverage: d.stats.sessionAverage, // sessions with an average of DNF will not appear
      numSolves: d.stats.numSolves,
    }));
    setChartData(data);
  };

  const renderJumbo = () => {
    return (
      chartData.length <= 1 &&
      !loading && (
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
      )
    );
  };

  return (
    <Container fluid className="text-center">
      {renderJumbo()}
    </Container>
  );
}
