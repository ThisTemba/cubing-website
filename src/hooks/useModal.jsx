import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CenterModalHeader from "../components/common/centerModalHeader";
import _ from "lodash";

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
    if (_.has(content, "title") && _.has(content, "body"))
      return (
        <Modal show={show} onHide={hideModal}>
          <CenterModalHeader title={content.title} onClose={hideModal} />
          <Modal.Body>{content.body}</Modal.Body>
          <Modal.Footer>
            {content.footer}
            <Button variant="secondary" onClick={hideModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      );
    else
      return (
        <Modal show={show} onHide={hideModal}>
          {content}
        </Modal>
      );
  };
  return [ModalComponent, showModal, hideModal, setContent, show];
}
