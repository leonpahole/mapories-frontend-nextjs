import React from "react";
import { Avatar, Icon, Panel } from "rsuite";
import { Chatroom } from "../../types/ChatroomMessage";

interface ChatroomsListProps {
  chatroom: Chatroom;
  onClick(): void;
}

const ChatroomsListItem: React.FC<ChatroomsListProps> = ({
  chatroom,
  onClick,
}) => {
  return (
    <Panel
      onClick={() => onClick()}
      className="c-pointer"
      header={
        <div className="d-flex justify-content-between">
          <div className="d-flex">
            <Avatar circle>
              <Icon icon="user" />
            </Avatar>
            <div className="ml-2">
              <p>
                <b>{chatroom.name}</b>
              </p>
              {chatroom.isOnline && (
                <div style={{ color: "green" }}>online</div>
              )}
              {!chatroom.isOnline && (
                <div style={{ color: "red" }}>offline</div>
              )}
            </div>
          </div>
        </div>
      }
      bodyFill={true}
    ></Panel>
  );
};

export default ChatroomsListItem;
