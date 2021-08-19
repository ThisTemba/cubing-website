import React, { useContext } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import DarkModeContext from "../../hooks/useDarkMode";
import TrainSettings from "../trainSettings";
const SettingsPage = () => {
  const { darkMode, setDarkMode } = useContext(DarkModeContext);

  const handleChange = () => {
    setDarkMode(!darkMode);
  };

  const settings = [
    {
      name: "Appearance",
      key: "appearance",
      content: (
        <Form.Check
          type="switch"
          id="custom-switch"
          label="Dark Mode"
          checked={darkMode}
          onChange={handleChange}
        />
      ),
    },
    {
      name: "Train",
      key: "train",
      content: <TrainSettings />,
    },
  ];

  return (
    <Container>
      <h2>Settings</h2>
      <Tab.Container
        id="left-tabs-example"
        defaultActiveKey={settings[0].key}
        transition={false}
      >
        <Row>
          <Col lg={4}>
            <ListGroup className="mb-2">
              {settings.map((s) => (
                <ListGroup.Item action eventKey={s.key}>
                  {s.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col lg={8}>
            <Tab.Content>
              {settings.map((s) => (
                <Tab.Pane eventKey={s.key}>
                  <Card>
                    <Card.Header>
                      <Card.Title>{s.name}</Card.Title>
                    </Card.Header>
                    <Card.Body>{s.content}</Card.Body>
                  </Card>
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default SettingsPage;
