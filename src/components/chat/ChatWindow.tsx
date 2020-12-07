import React, { useState, useCallback, useEffect, useContext } from "react";
import styled from "styled-components";
import { ChatroomMessage, Chatroom } from "../../types/ChatroomMessage";
import { FormInput, Button } from "shards-react";
import { getChatroomMessages } from "../../api/chat.api";
import { RootStore } from "../../redux/store";
import { useSelector, useDispatch } from "react-redux";
import { RoomStateI } from "../../redux/chat/chat.reducer";
import { ChatSocketContext } from "../../socket/ChatSocket";
import { PaginationInfo, defaultPaginationInfo } from "../post/PostsList";
import { fetchChatLog } from "../../redux/chat/chat.actions";

const WINDOW_WIDTH = 15;

const ChatWindowContainer = styled.div`
  position: fixed;
  height: 50vh;
  bottom: 0;
  background: white;
  z-index: 20;
  width: ${WINDOW_WIDTH}vw;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
`;

const ChatBodyContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: auto;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
`;

const ChatMessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 10px;
`;

const InputButtonContainer = styled.div`
  display: flex;
`;

interface ChatWindowProps {
  chatroom: Chatroom;
  onMinimize: () => void;
  onClose: () => void;
  index: number;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chatroom,
  onMinimize,
  onClose,
  index,
}) => {
  const [chatDiv, setChatDiv] = useState(null);
  const [chatMessage, setChatMessage] = useState<string>("");
  const [lastMessage, setLastMessage] = useState<ChatroomMessage | null>(null);

  const dispatch = useDispatch();

  const ws = useContext(ChatSocketContext);

  const room: RoomStateI | undefined = useSelector((state: RootStore) =>
    state.chats.rooms.find((r) => r.chatroomId === chatroom.id)
  );

  const chatDivRef = useCallback((node: any) => {
    setChatDiv(node);
    if (node) {
      nodeScrollToBottom(node);
    }
  }, []);

  const fetchMessages = async () => {
    let skip = 0;
    if (room) {
      skip = room.messages.length;
    }

    dispatch(fetchChatLog(chatroom.id, skip));
  };

  useEffect(() => {
    if (!room || room.messages.length < 10) {
      fetchMessages();
    }
  }, []);

  const sendMessage = () => {
    if (ws) {
      let messageToSend = chatMessage.trim();
      if (messageToSend.length > 0) {
        ws.sendMessage(chatroom.id, messageToSend);
        setChatMessage("");
      }
    }
  };

  const onMessageInputKeyDown = (e: any) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    if (room && room.messages.length > 0) {
      const currentLastMessage = room.messages[room.messages.length - 1];
      if (
        !lastMessage ||
        (lastMessage && lastMessage.createdAt !== currentLastMessage.createdAt)
      ) {
        setLastMessage(currentLastMessage);
        scrollToBottom();
      }
    }
  }, [room]);

  const scrollToBottom = () => {
    if (chatDiv) {
      nodeScrollToBottom(chatDiv);
    }
  };

  const nodeScrollToBottom = (node: any) => {
    node.scrollIntoView({ behavior: "auto" });
  };

  if (!room) {
    return null;
  }

  return (
    <ChatWindowContainer
      style={{
        right: `calc(${(index + 1) * WINDOW_WIDTH}vw + ${
          (index + 1) * WINDOW_WIDTH
        }px)`,
      }}
    >
      <div className="d-flex justify-content-between">
        <p className="m-0">{chatroom.name}</p>
        <div className="d-flex">
          <p className="p-3 m-0" onClick={onClose}>
            X
          </p>
          <p className="p-3 m-0" onClick={onMinimize}>
            _
          </p>
        </div>
      </div>
      <ChatBodyContainer>
        <ChatMessagesContainer>
          {room.moreAvailable && <Button onClick={fetchMessages}>More</Button>}
          {room.messages.map((m) => {
            return (
              <div>
                {m.sender.name}: {m.content}
              </div>
            );
          })}
          <div ref={chatDivRef}></div>
        </ChatMessagesContainer>
        <InputButtonContainer>
          <FormInput
            type="text"
            placeholder="Chat here"
            value={chatMessage}
            onKeyDown={onMessageInputKeyDown}
            onChange={(e: any) => setChatMessage(e.target.value)}
          />
          <Button onClick={sendMessage}>Send</Button>
        </InputButtonContainer>
      </ChatBodyContainer>
    </ChatWindowContainer>
  );
};

export default ChatWindow;
