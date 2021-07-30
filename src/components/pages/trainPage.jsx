import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import CaseSetDashboard from "../caseSetDashboard";
import { Route, Switch } from "react-router";
import TestPage from "./testPage";
import LearnPage from "./learnPage";

export default function TrainPage(props) {
  const [selectedCases, setSelectedCases] = useState();
  const [displayDashboard, setDisplayDashboard] = useState(true);
  const handleNewSelection = (params) => {
    setSelectedCases(params);
  };
  const handleTest = (params) => {
    console.log(params, "train");
    props.history.push("/train/test");
    setDisplayDashboard(false);
  };
  const handleLearn = (params) => {
    console.log(params, "learn");
    props.history.push("/train/learn");
    setDisplayDashboard(false);
  };

  useEffect(() => {
    // console.table(selectedCases);
  }, [selectedCases]);

  return (
    <Container>
      {displayDashboard && (
        <CaseSetDashboard
          setSelectedCases={handleNewSelection}
          onTest={handleTest}
          onLearn={handleLearn}
        />
        // Really weird bug where I try to render this inside a route
        // while at the same time calling setSelectedCases and setting
        // it to a local state here and the thing gets stuck in an infinite loop
        // this is a "fake route" that works using display dashboard which should
        // suffice for now
      )}
      <Switch>
        <Route
          path="/train/test"
          component={(props) => (
            <TestPage
              onDashboard={() => setDisplayDashboard(true)}
              selectedCases={selectedCases}
              {...props}
            />
          )}
        />
        <Route
          path="/train/learn"
          component={(props) => (
            <LearnPage
              onDashboard={() => setDisplayDashboard(true)}
              selectedCases={selectedCases}
              {...props}
            />
          )}
        />
      </Switch>
    </Container>
  );
}
