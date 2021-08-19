import React from "react";
import { FaIcon } from "../fontAwesome";
import { Button, Card } from "react-bootstrap";
import _ from "lodash";
import ButtonGroupToggle from "./common/buttonGroupToggle";
import useDarkMode from "../hooks/useDarkMode";

export default function FeedbackCard({ currentSolve, solves, setSolves }) {
  const [darkMode] = useDarkMode();

  const handleSelectMistake = (mistakes) => {
    const newSolves = [...solves];
    newSolves[0].mistakes = mistakes;
    setSolves(newSolves);
    document.activeElement.blur();
  };

  const handleToggleHesitation = () => {
    const newSolves = [...solves];
    newSolves[0].hesitated = !newSolves[0].hesitated;
    setSolves(newSolves);
    document.activeElement.blur();
  };

  const handleDelete = () => {
    setSolves(solves.length === 1 ? [] : _.tail(solves));
    document.activeElement.blur();
  };

  const mistakesButtons = [
    { content: <FaIcon icon="check" />, id: 0, color: "success" },
    { content: <FaIcon icon="minus" />, id: 1, color: "warning" },
    { content: <FaIcon icon="times" />, id: 2, color: "danger" },
  ];

  const hesitationButton = [
    {
      content: <FaIcon icon="spinner" />,
      id: 1,
      color: darkMode ? "light" : "dark",
    },
  ];

  const initial = typeof currentSolve === "undefined";
  const disabled = initial;
  const solveNum = initial ? "#" : solves.length;
  const caseName = initial ? "Case Name" : currentSolve.caseName;
  return (
    <div className="d-flex align-items-center justify-content-center">
      <Card
        style={{ width: 500 }}
        className="text-center mb-2"
        bg={darkMode ? "" : "light"}
      >
        <Card.Body>
          <Card.Title
            className={disabled ? "text-muted" : ""}
          >{`${solveNum}. ${caseName} `}</Card.Title>

          <ButtonGroupToggle
            buttons={hesitationButton}
            onSelect={() => handleToggleHesitation()}
            activeId={disabled ? null : currentSolve.hesitated ? 1 : 0}
            size="lg"
            disabled={disabled}
          />
          <ButtonGroupToggle
            buttons={mistakesButtons}
            onSelect={(id) => handleSelectMistake(id)}
            activeId={disabled ? null : currentSolve.mistakes}
            size="lg"
            disabled={disabled}
          />
          <Button
            className="m-1"
            variant="danger"
            size="lg"
            onClick={handleDelete}
            disabled={disabled}
          >
            <FaIcon icon="trash" />
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
