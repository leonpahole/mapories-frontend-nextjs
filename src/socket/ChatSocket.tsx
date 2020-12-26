import React, { createContext } from "react";
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
  socket: SocketIOClient.Socket;
  sendMessage: (chatroomId: string, message: string) => void;
  sendChatroomRead: (chatroomId: string) => void;
  sendChatroomTyping: (chatroomId: string, typing: boolean) => void;
};

const ChatSocketContext = createContext<ChatSocketContext | null>(null);

export { ChatSocketContext };

export default ({ children }: any) => {
  let socket: SocketIOClient.Socket | null = null;
  let ws: ChatSocketContext | null = null;

  const loggedInUserData = useLoggedInUserData();
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

  const sendChatroomRead = (chatroomId: string) => {
    const payload = {
      chatroomId,
    };

    if (socket) {
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

    if (socket) {
      socket.emit("event://send-chatroom-typing", payload);
    } else {
      console.warn("Socket not connected!");
    }
  };

  if (!socket && loggedInUserData) {
    socket = io.connect(wsUrl + "/chat", {
      query: {
        token: loggedInUserData.accessToken,
      },
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
      console.log("online-statuses");
      console.log(payload);
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

    ws = {
      socket: socket,
      sendMessage,
      sendChatroomRead,
      sendChatroomTyping,
    };
  }

  return (
    <ChatSocketContext.Provider value={ws}>
      {children}
    </ChatSocketContext.Provider>
  );
};
