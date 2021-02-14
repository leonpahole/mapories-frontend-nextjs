import React, { createContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import { useLoggedInUserData } from "../hooks/useLoggedInUser";
import {
  addOnlineUsers,
  receiveMessage,
  removeOnlineUsers,
  setChatroomRead,
  setChatroomTyping,
} from "../redux/chat/chat.actions";
import {
  BecomeOnlineMessage,
  SetChatroomTypingPayload,
  UpdateChatLogMessage,
} from "../types/ChatroomMessage";

const wsUrl = process.env.REACT_APP_WS_URL as string;

type ChatSocketContext = {
  socket: SocketIOClient.Socket | null;
  socketConnected: boolean;
  sendMessage: (chatroomId: string, message: string) => void;
  sendChatroomRead: (chatroomId: string) => void;
  sendChatroomTyping: (chatroomId: string, typing: boolean) => void;
};

const ChatSocketContext = createContext<ChatSocketContext | null>(null);

export { ChatSocketContext };

let socket: SocketIOClient.Socket | null = null;

export default ({ children }: any) => {
  let ws: ChatSocketContext | null = null;

  const loggedInUserData = useLoggedInUserData();
  const dispatch = useDispatch();
  const [socketConnected, setSocketConnected] = useState<boolean>(false);

  useEffect(() => {
    setSocketConnected(false);

    if (!loggedInUserData) {
      console.log("No access token, cannot connect to socket.");
      return;
    }

    console.log("Connecting to socket");
    socket = io.connect(wsUrl + "/chat", {
      query: {
        token: loggedInUserData.accessToken,
      },
    });

    socket.on("connect", () => {
      setSocketConnected(true);
      console.log("Socket connected!");
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
      console.log("Socket disconnected!");
    });

    socket.on("reconnection_attempt", () => {
      console.log("Socket attempting reconnect!");
    });

    socket.on("reconnect", () => {
      setSocketConnected(true);
      console.log("Socket reconnected!");
    });

    socket.on("event://get-message", (payload: UpdateChatLogMessage) => {
      dispatch(
        receiveMessage(
          payload.chatroomId,
          payload.message,
          loggedInUserData.user.id
        )
      );
    });

    socket.on("event://online-statuses", (payload: BecomeOnlineMessage[]) => {
      dispatch(addOnlineUsers(payload, loggedInUserData.user.id));
    });

    socket.on("event://become-online", (payload: BecomeOnlineMessage) => {
      if (payload.userId !== loggedInUserData.user.id) {
        dispatch(addOnlineUsers([payload], loggedInUserData.user.id));
      }
    });

    socket.on("event://become-offline", (payload: BecomeOnlineMessage) => {
      if (payload.userId !== loggedInUserData.user.id) {
        dispatch(removeOnlineUsers([payload], loggedInUserData.user.id));
      }
    });

    socket.on(
      "event://get-chatroom-read",
      (payload: { chatroomId: string; userId: string }) => {
        dispatch(
          setChatroomRead(
            payload.chatroomId,
            payload.userId,
            loggedInUserData.user.id
          )
        );
      }
    );

    socket.on(
      "event://get-chatroom-typing",
      (payload: SetChatroomTypingPayload) => {
        dispatch(setChatroomTyping(payload));
      }
    );

    return () => {
      console.log("Socket disconnecting");
      socket?.disconnect();
      socket?.removeAllListeners();
    };
  }, [loggedInUserData]);

  const sendMessage = (chatroomId: string, message: string) => {
    const payload = {
      chatroomId,
      message,
    };

    if (socket && socketConnected) {
      socket.emit("event://send-message", payload);
    } else {
      console.warn("Socket not connected!");
    }
  };

  const sendChatroomRead = (chatroomId: string) => {
    const payload = {
      chatroomId,
    };

    if (socket && socketConnected) {
      socket.emit("event://send-chatroom-read", payload);
    } else {
      console.warn("Socket not connected!");
    }
  };

  const sendChatroomTyping = (chatroomId: string, typing: boolean) => {
    const payload = {
      chatroomId,
      typing,
    };

    if (socket && socketConnected) {
      socket.emit("event://send-chatroom-typing", payload);
    } else {
      console.warn("Socket not connected!");
    }
  };

  ws = {
    socket: socket,
    socketConnected,
    sendMessage,
    sendChatroomRead,
    sendChatroomTyping,
  };

  return (
    <ChatSocketContext.Provider value={ws}>
      {children}
    </ChatSocketContext.Provider>
  );
};
