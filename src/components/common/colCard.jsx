import { Col, Card } from "react-bootstrap";
import useWindowDimensions from "../../hooks/useWindowDimensions";
export default function ColCard(props) {
  const { xs } = useWindowDimensions();
  const { colProps, cardStyle, title } = props;

  return (
    <Col className="p-0" {...colProps}>
      <Card className={xs ? "mt-2 mb-2" : "m-2"} style={cardStyle}>
        {title && (
          <Card.Header>
            <Card.Title className="m-1">{title}</Card.Title>
          </Card.Header>
        )}
        <Card.Body className={xs ? "p-0" : ""}>{props.children}</Card.Body>
      </Card>
    </Col>
  );
}
