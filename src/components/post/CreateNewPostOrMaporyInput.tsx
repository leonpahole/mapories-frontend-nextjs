import React, { useState } from "react";
import { Input } from "rsuite";
import { Post } from "../../types/Post";
import { CreateNewPostOrMaporyModal } from "./CreateNewPostOrMaporyModal";

interface CreateNewPostOrMaporyInputProps {
  onCreatePost(post: Post): void;
}

export const CreateNewPostOrMaporyInput: React.FC<CreateNewPostOrMaporyInputProps> = ({
  onCreatePost,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const onCreate = (p: Post) => {
    closeModal();
    onCreatePost(p);
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
      <CreateNewPostOrMaporyModal
        show={modalOpen}
        onHide={closeModal}
        size="lg"
        onCreate={(p) => onCreate(p)}
      />
    </div>
  );
};
