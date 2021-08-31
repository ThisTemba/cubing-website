import React from "react";
import Modal from "react-bootstrap/Modal";
import CloseButton from "react-bootstrap/CloseButton";

export default function CenterModalHeader({ title, onClose, style }) {
  return (
    <Modal.Header style={style}>
      <CloseButton disabled style={{ opacity: 0 }} />
      <Modal.Title>{title}</Modal.Title>
      <CloseButton onClick={onClose} />
    </Modal.Header>
  );
}
