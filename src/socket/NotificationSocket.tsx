import React, { createContext } from "react";
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import { useLoggedInUserData } from "../hooks/useLoggedInUser";
import { receiveNotification } from "../redux/notification/notification.actions";
import { Notification } from "../types/Notification";

const wsUrl = process.env.REACT_APP_WS_URL as string;

type NotificationSocketContext = {
  socket: SocketIOClient.Socket;
};

const NotificationSocketContext = createContext<NotificationSocketContext | null>(
  null
);

export { NotificationSocketContext };

export default ({ children }: any) => {
  let socket: SocketIOClient.Socket | null = null;
  let ws: NotificationSocketContext | null = null;

  const loggedInUserData = useLoggedInUserData();
  const dispatch = useDispatch();

  if (!socket && loggedInUserData) {
    socket = io.connect(wsUrl + "/notify", {
      query: {
        token: loggedInUserData.accessToken,
      },
    });

    socket.on("event://get-notification", (payload: Notification) => {
      dispatch(receiveNotification(payload));
    });

    ws = {
      socket: socket,
    };
  }

  return (
    <NotificationSocketContext.Provider value={ws}>
      {children}
    </NotificationSocketContext.Provider>
  );
};
