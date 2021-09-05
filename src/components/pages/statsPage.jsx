import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Row } from "react-bootstrap";
import Jumbotron from "react-bootstrap/Jumbotron";
import { UserContext } from "../../services/firebase";
import useMainSessionGroup from "../../hooks/useMainSessionGroup";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import ColCard from "../common/colCard";
import SessionsChart from "../sessionsChart";
import BestsTable from "../bestsTable";
import StatsOverviewTable from "../statsOverviewTable";
import ActivityChart from "../activityChart";

export default function StatsPage() {
  const { user } = useContext(UserContext);
  const sessionGroupDoc = useMainSessionGroup(user);
  const sessionGroup = sessionGroupDoc?.data();
  const loading = typeof sessionGroupDoc === "undefined";
  const { xs, md } = useWindowDimensions();

  const CustomJumbo = ({ title, body, buttons }) => {
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
        <CustomJumbo
          title="No Data Available"
          body="It seems like you haven't recorded any solves yet. Head over to the
    Time page and..."
          buttons={[{ text: "Get Solving!", to: "/time", variant: "primary" }]}
        />
      );
    else
      return (
        <CustomJumbo
          title="Account Required"
          body="You need to be logged in to your account to record and anaylze your solves"
          buttons={[
            { text: "Sign Up", to: "/signup", variant: "primary" },
            { text: "Log In", to: "/login", variant: "secondary" },
          ]}
        />
      );
  };

  const hasData = sessionGroup?.sessions?.length > 0;

  return (
    !loading && (
      <Container className="text-center">
        {!hasData && renderJumbo()}
        {hasData && (
          <Row noGutters>
            <ColCard colProps={{ xs: 12, lg: 6 }} title={"Personal Bests"}>
              <BestsTable bests={sessionGroup.bests} />
            </ColCard>
            <ColCard colProps={{ xs: 12, lg: 6 }} title={"Totals"}>
              <StatsOverviewTable sessionGroup={sessionGroup} />
            </ColCard>
            <ColCard colProps={{ xs: 12 }} title={"Activity"}>
              <ActivityChart
                sessions={sessionGroup.sessions}
                numDays={xs ? 93 : md ? 170 : 365}
              />
            </ColCard>
            <ColCard colProps={{ xs: 12 }} title={"Sessions"}>
              <SessionsChart sessionGroup={sessionGroup} />
            </ColCard>
          </Row>
        )}
      </Container>
    )
  );
}
