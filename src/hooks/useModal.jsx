import { useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CenterModalHeader from "../components/common/centerModalHeader";
import DarkModeContext from "./useDarkMode";
import _ from "lodash";

export default function useModal(size) {
  const [show, setShow] = useState(false);
  const [animation, setAnimation] = useState(true);
  const { darkMode } = useContext(DarkModeContext);
  const [content, _setContent] = useState({
    title: "Modal Title",
    body: "Modal Body",
    footer: "",
  });

  const setContent = (content) => {
    _setContent(content);
    setAnimation(false);
  };

  const showModal = (content) => {
    if (content) _setContent(content);
    setAnimation(true);
    setShow(true);
  };

  const hideModal = () => {
    setShow(false);
  };

  const modalColor = darkMode ? "#212529" : "#f8f9fa";

  const ModalComponent = () => {
    if (_.has(content, "title") && _.has(content, "body"))
      return (
        <Modal
          show={show}
          onHide={hideModal}
          animation={animation}
          size={size ? size : ""}
        >
          <CenterModalHeader
            title={content.title}
            onClose={hideModal}
            style={{ background: modalColor }}
          />
          <Modal.Body style={{ background: modalColor }}>
            {content.body}
          </Modal.Body>
          <Modal.Footer style={{ background: modalColor }}>
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
