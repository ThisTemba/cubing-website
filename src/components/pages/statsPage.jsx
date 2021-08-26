import React, { useEffect, useState, useContext } from "react";
import { Button, Container, Card } from "react-bootstrap";
import Jumbotron from "react-bootstrap/Jumbotron";
import _ from "lodash";
import { UserContext, getUserDocRef } from "../../services/firebase";
import { Link } from "react-router-dom";
import SessionsChart from "../sessionsChart";
import { mockSessions } from "../../data/mockSessionData";
import { getQ1, getQ2, getQ3 } from "../../utils/quantiles";

export default function StatsPage() {
  const { user } = useContext(UserContext);
  const [docs, setDocs] = useState();
  const [statsData, setStatsData] = useState(mockSessions);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDocs(mockSessions);
    getStatsData(mockSessions);
  }, []);

  // useEffect(() => {
  //   let unsubscribe = () => {};
  //   const userLoading = typeof user === "undefined";
  //   if (!userLoading) {
  //     if (user) {
  //       unsubscribe = readSessions((docs) => {
  //         setDocs(docs);
  //         getStatsData(docs);
  //       });
  //     } else setDocs(null);
  //   }
  //   return unsubscribe;
  // }, [user]);

  useEffect(() => {
    const userLoading = typeof user === "undefined";
    const docsLoading = typeof docs === "undefined";
    const statsLoading = userLoading || docsLoading;
    setLoading(statsLoading);
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

  const getGlobalStats = (sessions) => {
    const bests = [
      "bestSingle",
      "bestAo5",
      "bestAo12",
      "bestAo50",
      "bestAo100",
    ];
    const globalStats = {};
    bests.forEach((key) => {
      if (
        sessions.filter((sesh) => sesh.stats?.[key] !== undefined).length === 0
      )
        return;
      const sesh = _.minBy(sessions, (sesh) => sesh?.stats[key]);
      globalStats[key] = {
        sessionNum: sesh?.sessionNum,
        dur: sesh?.stats[key],
      };
    });
    globalStats.maxNumSolves = _.maxBy(
      sessions,
      "stats.numSolves"
    ).stats.numSolves;
    globalStats.minNumSolves = _.minBy(
      sessions,
      "stats.numSolves"
    ).stats.numSolves;
    return globalStats;
  };

  const getStatsData = (sessions) => {
    let data = sessions.map((sesh) => {
      const { sessionAverage, bestSingle, worstSingle } = sesh.stats;
      const rangeEB = [
        sessionAverage - bestSingle,
        worstSingle - sessionAverage,
      ];
      const durs = sesh.solves.map((s) => s.dur);
      const Q2 = getQ2(durs);
      const iqrEB = [Q2 - getQ1(durs), getQ3(durs) - Q2];
      return {
        ...sesh,
        ...sesh.stats,
        rangeEB,
        iqrEB,
      };
    });
    const globalStats = getGlobalStats(sessions);

    setStatsData({ globalStats, data });
  };

  const _Jumbo = ({ title, body, buttons }) => {
    return (
      <Jumbotron>
        <h1>{title}</h1>
        <p>{body}</p>
        {buttons.map((b) => (
          <Button as={Link} to={b.to} variant={b.variant}>
            {b.text}
          </Button>
        ))}
      </Jumbotron>
    );
  };

  const renderJumbo = (docs) => {
    if (docs?.length > 0) return;
    if (user)
      return (
        <_Jumbo
          title="No Data Available"
          body="It seems like you haven't recorded any solves yet. Head over to the
    Time page and..."
          buttons={[{ text: "Get Solving!", to: "/time", variant: "primary" }]}
        />
      );
    else
      return (
        <_Jumbo
          title="Log in Required"
          body="You need to be logged in to track and anaylze your solves"
          buttons={[
            { text: "Sign Up", to: "/signup", variant: "primary" },
            { text: "Log In", to: "/login", variant: "secondary" },
          ]}
        />
      );
  };

  return (
    !loading && (
      <Container className="text-center">
        {renderJumbo(docs)}
        <Card>
          <Card.Header>
            <Card.Title>Session Average Time vs Session Number</Card.Title>
          </Card.Header>

          <Card.Body>
            <SessionsChart
              data={statsData.data}
              globalStats={statsData.globalStats}
            />
          </Card.Body>
        </Card>
      </Container>
    )
  );
}
