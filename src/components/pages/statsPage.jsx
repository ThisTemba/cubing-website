import React, { useContext } from "react";
import { Button, Container, Card, Table } from "react-bootstrap";
import Jumbotron from "react-bootstrap/Jumbotron";
import _ from "lodash";
import { UserContext } from "../../services/firebase";
import { Link } from "react-router-dom";
import SessionsChart from "../sessionsChart";
import { dispDur } from "../../utils/displayValue";
import useMainSessionGroup from "../../hooks/useMainSessionGroup";

export default function StatsPage() {
  const { user } = useContext(UserContext);
  const sessionGroupDoc = useMainSessionGroup(user);
  const sessionGroup = sessionGroupDoc?.data();
  const loading = typeof sessionGroupDoc === "undefined";

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

  const renderJumbo = () => {
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
  const bests = [
    { label: "Ao100", key: "ao100" },
    { label: "Ao50", key: "ao50" },
    { label: "Ao12", key: "ao12" },
    { label: "Ao5", key: "ao5" },
    { label: "Single", key: "single" },
  ];

  return (
    !loading && (
      <Container className="text-center">
        {!sessionGroup && renderJumbo()}

        {sessionGroup && (
          <>
            <Card className="m-2">
              <Card.Header>
                <Card.Title className="m-1">Personal Bests</Card.Title>
              </Card.Header>
              <Card.Body>
                <Table responsive>
                  <tr>
                    {bests.map((b) => {
                      return <th>{b.label}</th>;
                    })}
                  </tr>
                  <tr>
                    {bests.map((b) => {
                      const time = dispDur(sessionGroup.bests[b.key]?.dur);
                      return <td>{time}</td>;
                    })}
                  </tr>
                  <tr style={{ fontSize: 14 }}>
                    {bests.map((b) => {
                      const dateTime = sessionGroup.bests[b.key]?.dateTime;
                      const date = dateTime
                        ? new Date(dateTime).toLocaleDateString()
                        : "";
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
                <SessionsChart sessionGroup={sessionGroup} />
              </Card.Body>
            </Card>
          </>
        )}
      </Container>
    )
  );
}
