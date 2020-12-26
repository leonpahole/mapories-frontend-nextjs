import React, { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon, IconButton, Input } from "rsuite";
import styled from "styled-components";
import { useLoggedInUser } from "../../hooks/useLoggedInUser";
import { fetchChatroomMessages } from "../../redux/chat/chat.actions";
import { RootStore } from "../../redux/store";
import { ChatSocketContext } from "../../socket/ChatSocket";

const WINDOW_WIDTH = 15;

const ChatWindowContainer = styled.div`
  position: fixed;
  height: 50vh;
  bottom: 0;
  background: white;
  z-index: 99999;
  width: ${WINDOW_WIDTH}vw;
  border: 1px solid gray;
  display: flex;
  flex-direction: column;
  border-radius: 10px 10px 0px 0px;
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
  margin-top: 7px;
  display: flex;
`;

interface ChatWindowProps {
  chatroomId: string;
  onMinimize: () => void;
  onClose: () => void;
  index: number;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chatroomId,
  onMinimize,
  onClose,
  index,
}) => {
  const [chatDiv, setChatDiv] = useState(null);

  const [chatMessage, setChatMessage] = useState<string>("");

  const dispatch = useDispatch();

  const chatroom = useSelector((r: RootStore) =>
    r.chats.chatrooms.find((c) => c.id === chatroomId)
  );
  const lastMessage = useSelector(
    (r: RootStore) => r.chats.mostRecentMessageChatroom
  );

  const loggedInUser = useLoggedInUser();

  const ws = useContext(ChatSocketContext);

  const chatDivRef = useCallback((node: any) => {
    setChatDiv(node);
    if (node) {
      nodeScrollToBottom(node);
    }
  }, []);

  const fetchMessages = async () => {
    if (!chatroom) {
      return;
    }

    dispatch(fetchChatroomMessages(chatroom.id, chatroom.messages.data.length));
  };

  useEffect(() => {
    if (!chatroom || chatroom.messages.data.length < 10) {
      fetchMessages();
    }
  }, []);

  const sendMessage = () => {
    if (ws && chatroom) {
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
    if (chatroom && lastMessage && lastMessage.id === chatroom.id) {
      scrollToBottom();
    }
  }, [lastMessage]);

  const scrollToBottom = () => {
    if (chatDiv) {
      nodeScrollToBottom(chatDiv);
    }
  };

  const nodeScrollToBottom = (node: any) => {
    node.scrollIntoView({ behavior: "auto" });
  };

  if (!chatroom) {
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
      <div className="d-flex justify-content-between align-items-center">
        <p className="m-0 pl-2">
          <b>{chatroom.name}</b>
        </p>
        <div className="d-flex">
          <Icon
            className="p-3 m-0 c-pointer"
            icon="window-minimize"
            onClick={onMinimize}
          />
          <Icon className="p-3 m-0 c-pointer" icon="close" onClick={onClose} />
        </div>
      </div>
      <ChatBodyContainer>
        <ChatMessagesContainer id={`chat-list-div-${chatroom.id}`}>
          {chatroom.messages.moreAvailable && (
            <div className="c-pointer mb-2" onClick={() => fetchMessages()}>
              <b>Load more</b>
            </div>
          )}
          {chatroom.messages.data.map((m) => {
            let senderItem = null;
            if (m.sender.id === loggedInUser!.id) {
              senderItem = (
                <b>
                  <i>You</i>
                </b>
              );
            } else {
              senderItem = <b>{m.sender.name}</b>;
            }

            return (
              <div className="mb-1">
                {senderItem}: {m.content}
              </div>
            );
          })}
          <div ref={chatDivRef}></div>
        </ChatMessagesContainer>
        <InputButtonContainer>
          <Input
            type="text"
            placeholder="Aa"
            value={chatMessage}
            onKeyDown={onMessageInputKeyDown}
            onChange={(v: string) => setChatMessage(v)}
          />
          <IconButton appearance="primary" icon={<Icon icon="send-o" />} />
        </InputButtonContainer>
      </ChatBodyContainer>
    </ChatWindowContainer>
  );
};

export default ChatWindow;
