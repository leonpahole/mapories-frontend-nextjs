import React, { createContext } from "react";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import {
  updateChatLog,
  addOnlineUsers,
  removeOnlineUsers,
} from "../redux/chat/chat.actions";
import {
  UpdateChatLogMessage,
  BecomeOnlineMessage,
} from "../types/ChatroomMessage";
import { RootStore } from "../redux/store";

const wsUrl = process.env.REACT_APP_WS_URL as string;

type ChatSocketContext = {
  socket: SocketIOClient.Socket;
  sendMessage: (chatroomId: string, message: string) => void;
};

const ChatSocketContext = createContext<ChatSocketContext | null>(null);

export { ChatSocketContext };

export default ({ children }: any) => {
  let socket: SocketIOClient.Socket | null = null;
  let ws: ChatSocketContext | null = null;

  const loggedInUser = useSelector(
    (state: RootStore) => state.auth.loggedInUser
  );
  const dispatch = useDispatch();

  const sendMessage = (chatroomId: string, message: string) => {
    const payload = {
      chatroomId,
      message,
    };

    if (socket) {
      socket.emit("event://send-message", payload);
    } else {
      console.warn("Socket not connected!");
    }
  };

  if (!socket && loggedInUser) {
    socket = io.connect(wsUrl + "/chat", {
      query: {
        id: loggedInUser!.id,
      },
    });

    socket.on("event://get-message", (payload: UpdateChatLogMessage) => {
      dispatch(updateChatLog(payload));
    });

    socket.on("event://become-online", (payload: BecomeOnlineMessage) => {
      if (payload.userId !== loggedInUser.id) {
        dispatch(addOnlineUsers([payload]));
      }
    });

    socket.on("event://become-offline", (payload: BecomeOnlineMessage) => {
      if (payload.userId !== loggedInUser.id) {
        dispatch(removeOnlineUsers([payload]));
      }
    });

    socket.on("event://online-statuses", (payload: BecomeOnlineMessage[]) => {
      console.log("online-statuses");
      console.log(payload);
      dispatch(addOnlineUsers(payload));
    });

    ws = {
      socket: socket,
      sendMessage,
    };
  }

  return (
    <ChatSocketContext.Provider value={ws}>
      {children}
    </ChatSocketContext.Provider>
  );
};
