import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { RootStore } from "../../redux/store";
import { Chatroom } from "../../types/ChatroomMessage";
import { Loading } from "../Loading";

const ChatroomListContainer = styled.div`
  position: fixed;
  background: white;
  right: 0;
  top: 0;
  bottom: 0;
  width: 20vw;
  height: 100vh;
  color: black;
  z-index: 10;
`;

const ChatHeadingContainer = styled.div`
  padding: 20px 10px;
  color: black;
  cursor: pointer;
`;

const ChatHeading = styled.h5`
  text-align: center;
`;

const ChatroomListItemContainer = styled.div`
  padding: 5px 10px;
  color: black;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
`;

const MaximizeChatContainer = styled.div`
  position: fixed;
  height: 10vh;
  right: 0;
  bottom: 0;
  background: white;
  z-index: 10;
  cursor: pointer;
`;

interface ChatroomsListProps {
  chatrooms: Chatroom[];
  onChatroomClick(chatroom: Chatroom): void;
  loadingChatrooms: boolean;
}

const ChatroomsList: React.FC<ChatroomsListProps> = ({
  chatrooms,
  onChatroomClick,
  loadingChatrooms,
}) => {
  const onlineChatrooms = useSelector(
    (state: RootStore) => state.chats.onlineChatrooms
  );

  const [singleChatrooms, setSingleChatrooms] = useState<Chatroom[]>([]);
  const [multiChatrooms, setMultiChatrooms] = useState<Chatroom[]>([]);

  const [minimized, setMinimized] = useState<boolean>(false);

  useEffect(() => {
    setSingleChatrooms(chatrooms.filter((c) => c.participant != null));
    setMultiChatrooms(chatrooms.filter((c) => c.participants != null));
  }, [chatrooms]);

  let singleChatroomList, multiChatroomList;

  const toggle = () => {
    setMinimized(!minimized);
  };

  if (minimized) {
    return <MaximizeChatContainer onClick={toggle}>Chat</MaximizeChatContainer>;
  }

  if (loadingChatrooms) {
    singleChatroomList = <Loading />;
    multiChatroomList = <Loading />;
  } else {
    singleChatroomList = (
      <div>
        {singleChatrooms.map((c) => {
          const isOnline = onlineChatrooms.find((cr) => cr.chatroomId === c.id);

          return (
            <ChatroomListItemContainer>
              <p onClick={() => onChatroomClick(c)}>{c.name}</p>
              <Link to={`/profile/${c.participant!.id}`}>
                <small className="text-secondary c-pointer  mt-3 mb-3">P</small>
              </Link>
              {isOnline && (
                <small className="text-secondary c-pointer  mt-3 mb-3">
                  Online
                </small>
              )}
            </ChatroomListItemContainer>
          );
        })}
      </div>
    );

    multiChatroomList = (
      <div>
        {multiChatrooms.map((c) => (
          <ChatroomListItemContainer>
            <p onClick={() => onChatroomClick(c)}>{c.name}</p>
          </ChatroomListItemContainer>
        ))}
      </div>
    );
  }

  return (
    <ChatroomListContainer>
      <ChatHeadingContainer>
        <ChatHeading onClick={toggle}>Chat</ChatHeading>
      </ChatHeadingContainer>
      {singleChatroomList}
      <hr />
      {multiChatroomList}
    </ChatroomListContainer>
  );
};

export default ChatroomsList;
