import React from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import ListGroup from "react-bootstrap/ListGroup";
import useDarkMode from "../../hooks/useDarkMode";
const SettingsPage = () => {
  const [darkMode, setDarkMode] = useDarkMode();

  const handleChange = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Container>
      <h2>Settings</h2>
      <Tab.Container
        id="left-tabs-example"
        defaultActiveKey="appearance"
        transition={false}
      >
        <Row>
          <Col lg={4}>
            <ListGroup className="mb-2">
              <ListGroup.Item action eventKey="appearance">
                Appearance
              </ListGroup.Item>
              <ListGroup.Item action eventKey="account">
                Account
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col lg={8}>
            <Tab.Content>
              <Tab.Pane eventKey="appearance">
                <Card>
                  <Card.Header>
                    <Card.Title>Appearance</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      label="Dark Mode"
                      checked={darkMode}
                      onChange={handleChange}
                    />
                  </Card.Body>
                </Card>
              </Tab.Pane>
              <Tab.Pane eventKey="account">
                <Card>
                  <Card.Header>
                    <Card.Title>Account</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    {/* <Form>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                          We'll never share your email with anyone else.
                        </Form.Text>
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicCheckbox"
                      >
                        <Form.Check type="checkbox" label="Check me out" />
                      </Form.Group>
                      <Button variant="primary" type="submit">
                        Submit
                      </Button>
                    </Form> */}
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default SettingsPage;
