import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import useDarkMode from "../../hooks/useDarkMode";

export default function CenterCard({ title, content, textBelowCard, error }) {
  const [darkMode] = useDarkMode();
  const renderErrorAlert = (error) => {
    return (
      error && (
        <Alert variant="danger" className="m-2">
          {error.message}
        </Alert>
      )
    );
  };
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <div className="w-100" style={{ maxWidth: "380px" }}>
        <Card bg={darkMode ? "dark" : "light"}>
          <Card.Body>
            <h4 className="text-center mb-4">{title}</h4>
            {content}
          </Card.Body>
        </Card>
        {renderErrorAlert(error)}
        <div className="w-100 text-center mt-2">{textBelowCard}</div>
      </div>
    </Container>
  );
}

CenterCard.defaultProps = {
  error: null,
};
