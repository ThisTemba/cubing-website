import React, { useEffect, useState, useContext } from "react";
import { Button, Container, Card, Table } from "react-bootstrap";
import Jumbotron from "react-bootstrap/Jumbotron";
import _ from "lodash";
import { UserContext, getUserDocRef } from "../../services/firebase";
import { Link } from "react-router-dom";
import SessionsChart from "../sessionsChart";
import { mockSessions } from "../../data/mockSessionData";
import { getQ1, getQ2, getQ3 } from "../../utils/quartiles";
import { dispDur } from "../../utils/displayValue";

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
      .orderBy("timeStamp", "asc")
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
      if (sessions.filter((sesh) => sesh?.[key] !== undefined).length === 0)
        return;
      const sesh = _.minBy(sessions, (sesh) => sesh?.[key]);
      globalStats[key] = {
        date: sesh?.date,
        dur: sesh?.[key],
        sessionNum: sesh?.sessionNum,
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

  const getStatsData = (oldSessions) => {
    let sessions = oldSessions.map((sesh, i) => {
      const { sessionAverage, bestSingle, worstSingle } = sesh.stats;
      const rangeEB = [
        sessionAverage - bestSingle,
        worstSingle - sessionAverage,
      ];
      const durs = sesh.solves.map((s) => s.dur);
      const Q2 = getQ2(durs);
      const iqrEB = [Q2 - getQ1(durs), getQ3(durs) - Q2];
      const stats = _.mapValues(sesh.stats, (s) => _.round(s, 2));
      return {
        sessionNum: i + 1,
        ...sesh,
        ...stats,
        rangeEB,
        iqrEB,
      };
    });
    let cbs = sessions[0].bestSingle;
    let cb5 = sessions[0].bestAo5;
    let cb12 = sessions[0].bestAo12;
    let cb50 = sessions[0].bestAo50;
    let cb100 = sessions[0].bestAo100;
    const data = sessions.map((sesh, i) => {
      const { sessionAverage, dateTime } = sesh;
      const { stats: statsRaw } = sesh;
      const rangeEB = [
        statsRaw.sessionAverage - statsRaw.bestSingle,
        statsRaw.worstSingle - statsRaw.sessionAverage,
      ];
      const durs = sesh.solves.map((s) => s.dur);
      const Q2 = getQ2(durs);
      const iqrEB = [Q2 - getQ1(durs), getQ3(durs) - Q2];
      const stats = _.mapValues(sesh.stats, (s) => _.round(s, 2));
      const bestSingle = cbs
        ? stats.bestSingle < cbs
          ? stats.bestSingle
          : cbs
        : stats.bestSingle;
      const bestAo5 = cb5
        ? stats.bestAo5 < cb5
          ? stats.bestAo5
          : cb5
        : stats.bestAo5;
      const bestAo12 = cb12
        ? stats.bestAo12 < cb12
          ? stats.bestAo12
          : cb12
        : stats.bestAo12;
      const bestAo50 = cb50
        ? stats.bestAo50 < cb50
          ? stats.bestAo50
          : cb50
        : stats.bestAo50;
      const bestAo100 = cb100
        ? stats.bestAo100 < cb100
          ? stats.bestAo100
          : cb100
        : stats.bestAo100;
      cbs = bestSingle;
      cb5 = bestAo5;
      cb12 = bestAo12;
      cb50 = bestAo50;
      cb100 = bestAo100;
      if (cb100) {
        console.log();
      }
      const dataPoint = {
        dateTime,
        sessionNum: i + 1,
        sessionAverage: _.round(sessionAverage, 2),
        bestSingle,
        bestAo5,
        bestAo12,
        bestAo50,
        bestAo100,
        rangeEB,
        iqrEB,
      };
      return dataPoint;
    });
    const globalStats = getGlobalStats(sessions);
    console.log(JSON.stringify(sessions));
    setStatsData({ globalStats, sessions, data });
  };

  const _Jumbo = ({ title, body, buttons }) => {
    return (
      <Jumbotron>
        <h1>{title}</h1>
        <p>{body}</p>
        {buttons.map((b) => (
          <Button as={Link} to={b.to} variant={b.variant} className="m-1">
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
  console.log(statsData);
  const bests = ["bestAo100", "bestAo50", "bestAo12", "bestAo5", "bestSingle"];

  return (
    !loading && (
      <Container className="text-center">
        {renderJumbo(docs)}
        <Card className="m-2">
          <Card.Header>
            <Card.Title className="m-1">Personal Bests</Card.Title>
          </Card.Header>

          <Card.Body>
            <Table responsive>
              <tr>
                <th>Ao100</th>
                <th>Ao50</th>
                <th>Ao12</th>
                <th>Ao5</th>
                <th>Single</th>
              </tr>
              <tr>
                {bests.map((b) => {
                  const time = dispDur(statsData.globalStats[b]?.dur);
                  return <td>{time}</td>;
                })}
              </tr>
              <tr style={{ fontSize: 14 }}>
                {bests.map((b) => {
                  const date = statsData.globalStats[b]?.date;
                  return <td>{date}</td>;
                })}
              </tr>
            </Table>
          </Card.Body>
        </Card>
        <Card className="m-2">
          <Card.Header>
            <Card.Title className="m-1">
              Session Average vs Session Number
            </Card.Title>
          </Card.Header>

          <Card.Body>
            <SessionsChart statsData={statsData} />
          </Card.Body>
        </Card>
      </Container>
    )
  );
}
