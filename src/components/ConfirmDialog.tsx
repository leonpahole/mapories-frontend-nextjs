import React from "react";
import { Modal, Button } from "rsuite";
import { TypeAttributes } from "rsuite/lib/@types/common";

interface ConfirmDialogProps {
  show: boolean;
  onClose(): void;
  onConfirm(): void;
  header: string;
  text: string;
  size?: TypeAttributes.Size;
  confirmButtonText?: string;
  confirmButtonAppearance?: TypeAttributes.Appearance;
  confirmButtonColor?: TypeAttributes.Color;
  cancelButtonText?: string;
  cancelButtonAppearance?: TypeAttributes.Appearance;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  show,
  onClose,
  onConfirm,
  header,
  text,
  size,
  confirmButtonText,
  confirmButtonAppearance,
  confirmButtonColor,
  cancelButtonText,
  cancelButtonAppearance,
}) => {
  return (
    <Modal backdrop="static" show={show} onHide={onClose} size={size || "xs"}>
      <Modal.Header>{header}</Modal.Header>
      <Modal.Body>{text}</Modal.Body>
      <Modal.Footer>
        <Button
          onClick={onConfirm}
          appearance={confirmButtonAppearance || "primary"}
          color={confirmButtonColor || "blue"}
        >
          {confirmButtonText || "Ok"}
        </Button>
        <Button
          onClick={onClose}
          appearance={cancelButtonAppearance || "subtle"}
        >
          {cancelButtonText || "Cancel"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
