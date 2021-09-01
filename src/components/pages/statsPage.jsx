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
import ActivityChart from "../activityChart";

export default function StatsPage() {
  const { user } = useContext(UserContext);
  const sessionGroupDoc = useMainSessionGroup(user);
  const sessionGroup = sessionGroupDoc?.data();
  const loading = typeof sessionGroupDoc === "undefined";
  const { xs, md } = useWindowDimensions();

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

  const statCardClass = xs ? "mt-2 mb-2" : "m-2";
  const cardTitleClass = "m-1";
  const hasData = sessionGroup?.sessions?.length > 0;
  const colStyle = { padding: 0 };

  return (
    !loading && (
      <Container className="text-center">
        {!hasData && renderJumbo()}
        {hasData && (
          <Row noGutters>
            <Col xs={12} lg={6} style={colStyle}>
              <Card className={statCardClass}>
                <Card.Header>
                  <Card.Title className={cardTitleClass}>
                    Personal Bests
                  </Card.Title>
                </Card.Header>
                <Card.Body className={xs ? "p-0" : ""}>
                  <BestsTable bests={sessionGroup.bests} />
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} lg={6} style={colStyle}>
              <Card className={statCardClass}>
                <Card.Header>
                  <Card.Title className={cardTitleClass}>Totals</Card.Title>
                </Card.Header>
                <Card.Body className={xs ? "p-0" : ""}>
                  <StatsOverviewTable sessionGroup={sessionGroup} />
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} style={colStyle}>
              <Card className={statCardClass}>
                <Card.Header>
                  <Card.Title className={cardTitleClass}>Activity</Card.Title>
                </Card.Header>
                <Card.Body className="pl-4 pr-4">
                  <ActivityChart
                    sessions={sessionGroup.sessions}
                    numDays={xs ? 93 : md ? 170 : 365}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} style={colStyle}>
              <Card className={statCardClass}>
                <Card.Header>
                  <Card.Title className={cardTitleClass}>Sessions</Card.Title>
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
