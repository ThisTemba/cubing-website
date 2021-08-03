import React from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
const SettingsPage = (props) => {
  return (
    <Container>
      <h1>Settings</h1>
      <Tab.Container
        id="left-tabs-example"
        defaultActiveKey="first"
        transition={false}
      >
        <Row>
          <Col lg={4}>
            <ListGroup>
              <ListGroup.Item action eventKey="first">
                Account
              </ListGroup.Item>
              <ListGroup.Item action eventKey="second">
                Appearance
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col lg={8}>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <Card>
                  <Card.Header>
                    <Card.Title>Account</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Form>
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
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <Card>
                  <Card.Header>
                    <Card.Title>Appearance</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      label="Dark Mode"
                    />
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
