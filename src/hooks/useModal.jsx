import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CloseButton from "react-bootstrap/CloseButton";

export default function useModal() {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState({
    title: "Modal Title",
    body: "Modal Body",
    footer: "",
  });

  const showModal = (content) => {
    if (content) setContent(content);
    setShow(true);
  };

  const hideModal = () => {
    setShow(false);
  };

  const ModalComponent = () => {
    return (
      <Modal show={show} onHide={hideModal}>
        <Modal.Header>
          <CloseButton disabled style={{ opacity: 0 }} />
          <Modal.Title>{content.title}</Modal.Title>
          <CloseButton onClick={hideModal} />
        </Modal.Header>
        <Modal.Body>{content.body}</Modal.Body>
        <Modal.Footer>
          {content.footer}
          <Button variant="secondary" onClick={hideModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  return [ModalComponent, showModal, hideModal];
}
