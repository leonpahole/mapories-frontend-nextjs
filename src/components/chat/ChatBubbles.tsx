import React from "react";
import { Avatar, Badge, Icon } from "rsuite";
import styled from "styled-components";
import { Chatroom } from "../../types/ChatroomMessage";

const ChatBubbleContainer = styled.div`
  border-radius: 50%;
  border: 1px solid gray;
  position: fixed;
  height: 80px;
  width: 80px;
  bottom: 1vh;
  right: 3vw;
  background: white;
  z-index: 99999;
  cursor: pointer;
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
        <ChatBubbleContainer
          onClick={() => {
            onOpen(c);
          }}
        >
          <Badge
            style={{ width: "100%", height: "100%" }}
            content={c.isUnread ? "NEW" : false}
          >
            <Avatar style={{ width: "100%", height: "100%" }} size="lg" circle>
              <Icon icon="user" />
            </Avatar>
          </Badge>
        </ChatBubbleContainer>
      ))}
    </>
  );
};

export default ChatBubbles;
