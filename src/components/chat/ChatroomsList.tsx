import React from "react";
import { Drawer } from "rsuite";
import { Chatroom } from "../../types/ChatroomMessage";
import { Loading } from "../Loading";
import ChatroomsListItem from "./ChatroomListItem";

interface ChatroomsListProps {
  chatrooms: Chatroom[];
  onChatroomClick(chatroom: Chatroom): void;
  loadingChatrooms: boolean;
  showChat: boolean;
  onClose(): void;
}

const ChatroomsList: React.FC<ChatroomsListProps> = ({
  chatrooms,
  onChatroomClick,
  loadingChatrooms,
  showChat,
  onClose,
}) => {
  let singleChatroomList = null;

  if (loadingChatrooms) {
    singleChatroomList = <Loading />;
  } else {
    if (chatrooms && chatrooms.length > 0) {
      singleChatroomList = (
        <div>
          {chatrooms.map((c) => (
            <ChatroomsListItem
              key={c.id}
              chatroom={c}
              onClick={() => {
                onChatroomClick(c);
              }}
            />
          ))}
        </div>
      );
    } else {
      singleChatroomList = <p>No people to chat with at this time.</p>;
    }
  }

  return (
    <Drawer
      backdrop={false}
      show={showChat}
      onHide={() => onClose()}
      size="xs"
      className="chat-drawer"
    >
      <Drawer.Header>
        <Drawer.Title>Chat</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>{singleChatroomList}</Drawer.Body>
    </Drawer>
  );
};

export default ChatroomsList;
