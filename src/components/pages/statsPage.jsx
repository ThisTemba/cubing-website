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
    let unsubscribe = () => {};
    const userLoading = typeof user === "undefined";
    if (!userLoading) {
      if (user) {
        unsubscribe = readSessions((docs) => {
          setDocs(docs);
          getChartData(docs);
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
    console.log(docsLoading, userLoading);
  }, [user, docs]);

  const readSessions = (callback) => {
    const unsubscribe = getUserDocRef(user)
      .collection("sessions")
      .onSnapshot((snapshot) => {
        let docs = snapshot.docs;
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
      sessionAverage: d.stats?.sessionAverage, // sessions with an average of DNF will not appear
      numSolves: d.stats?.numSolves,
    }));
    setChartData(data);
  };

  const renderJumbo = (docs) => {
    console.log(docs);
    console.log(docs?.length);
    if (docs?.length > 0) return;
    if (user)
      return (
        <Jumbotron>
          <h1>No Data Available</h1>
          <p>
            It seems like you haven't recorded any solves yet. Head over to the
            Time page and...
          </p>
          <Button as={Link} to="/time" className="m-1" variant="primary">
            Get Solving!
          </Button>
        </Jumbotron>
      );
    else
      return (
        <Jumbotron>
          <h1>Log in Required</h1>
          <p>You need to be logged in to track and anaylze your solves</p>
          <Button as={Link} to="/signup" className="m-1" variant="primary">
            Sign Up
          </Button>
          <Button as={Link} to="/login" className="m-1" variant="secondary">
            Log In
          </Button>
        </Jumbotron>
      );
  };

  return (
    !loading && (
      <Container className="text-center">{renderJumbo(docs)}</Container>
    )
  );
}
