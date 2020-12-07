import React, { useState, useRef } from "react";
import { Input, Modal, Button } from "rsuite";
import { CreateNewPostOrMapory } from "./CreateNewPostOrMapory";
import { Post } from "../../types/Post";

interface CreateNewPostOrMaporyInputProps {
  onCreatePost(post: Post): void;
  onUpdatePost(post: Post): void;
}

export const CreateNewPostOrMaporyInput: React.FC<CreateNewPostOrMaporyInputProps> = ({
  onCreatePost,
  onUpdatePost,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <Input
        size="lg"
        placeholder="What is on your mind?"
        onClick={openModal}
        value={""}
        onChange={openModal}
      />
      <Modal show={modalOpen} onHide={closeModal} size="sm">
        <Modal.Header>
          <p className="subtitle">Create post</p>
        </Modal.Header>
        <Modal.Body>
          <CreateNewPostOrMapory
            onCreate={onCreatePost}
            onUpdate={onUpdatePost}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={closeModal} appearance="primary">
            Ok
          </Button>
          <Button onClick={closeModal} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
