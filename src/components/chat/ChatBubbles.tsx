import React from "react";
import styled from "styled-components";
import { Chatroom } from "../../types/ChatroomMessage";

const ChatBubbleContainer = styled.div`
  border-radius: 50%;
  border: 1px solid black;
  position: fixed;
  height: 100px;
  width: auto;
  bottom: 0;
  right: 5vw;
  height: 5vh
  background: white;
  z-index: 100;
`;

interface ChatBubblesProps {
  chatrooms: Chatroom[];
  onOpen: (c: Chatroom) => void;
  onClose: (c: Chatroom) => void;
}

const ChatBubbles: React.FC<ChatBubblesProps> = ({
  chatrooms,
  onOpen,
  onClose,
}) => {
  return (
    <>
      {chatrooms.map((c) => (
        <ChatBubbleContainer>
          <div onClick={() => onOpen(c)}>{c.name}</div>
          <div onClick={() => onClose(c)}>Close</div>
          {c.isUnread && <div>UNREAD</div>}
        </ChatBubbleContainer>
      ))}
    </>
  );
};

export default ChatBubbles;
