import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function useModal() {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState({
    title: "Modal Title",
    body: "Modal Body",
    footer: "",
  });
  const showModal = (content) => {
    setContent(content);
    setShow(true);
  };
  const ModalComponent = () => {
    return (
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{content.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{content.body}</Modal.Body>
        <Modal.Footer>
          {content.footer}
          <Button variant="secondary" onClick={() => setShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  return [ModalComponent, showModal];
}
