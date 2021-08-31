import React, { useContext } from "react";
import { Button, Container, Card, Col, Row } from "react-bootstrap";
import Jumbotron from "react-bootstrap/Jumbotron";
import _ from "lodash";
import { UserContext } from "../../services/firebase";
import { Link } from "react-router-dom";
import SessionsChart from "../sessionsChart";
import useMainSessionGroup from "../../hooks/useMainSessionGroup";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import BestsTable from "../bestsTable";
import StatsOverviewTable from "../statsOverviewTable";

export default function StatsPage() {
  const { user } = useContext(UserContext);
  const sessionGroupDoc = useMainSessionGroup(user);
  const sessionGroup = sessionGroupDoc?.data();
  const loading = typeof sessionGroupDoc === "undefined";
  const { xs } = useWindowDimensions();

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
          title="Account Required"
          body="You need to be logged in to your account to record and anaylze your solves"
          buttons={[
            { text: "Sign Up", to: "/signup", variant: "primary" },
            { text: "Log In", to: "/login", variant: "secondary" },
          ]}
        />
      );
  };

  const statCardClassName = xs ? "mt-2 mb-3" : "mb-2 mt-2";

  return (
    !loading && (
      <Container className="text-center">
        {!sessionGroup && renderJumbo()}
        {sessionGroup && (
          <Row>
            <Col xs={12} lg={6}>
              <Card className={statCardClassName}>
                <Card.Header>
                  <Card.Title className="m-1">Personal Bests</Card.Title>
                </Card.Header>
                <Card.Body className={xs ? "p-0" : ""}>
                  <BestsTable bests={sessionGroup.bests} />
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} lg={6}>
              <Card className={statCardClassName}>
                <Card.Header>
                  <Card.Title className="m-1">Totals</Card.Title>
                </Card.Header>
                <Card.Body className={xs ? "p-0" : ""}>
                  <StatsOverviewTable sessionGroup={sessionGroup} />
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12}>
              <Card className={statCardClassName}>
                <Card.Header>
                  <Card.Title className="m-1">Sessions</Card.Title>
                </Card.Header>
                <Card.Body className={xs ? "p-2" : ""}>
                  <SessionsChart sessionGroup={sessionGroup} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    )
  );
}
