import React, { createContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import { useLoggedInUserData } from "../hooks/useLoggedInUser";
import { receiveNotification } from "../redux/notification/notification.actions";
import { Notification } from "../types/Notification";

const wsUrl = process.env.REACT_APP_WS_URL as string;

type NotificationSocketContext = {
  socket: SocketIOClient.Socket | null;
};

const NotificationSocketContext = createContext<NotificationSocketContext | null>(
  null
);

export { NotificationSocketContext };

let socket: SocketIOClient.Socket | null = null;

export default ({ children }: any) => {
  let ws: NotificationSocketContext | null = null;

  const loggedInUserData = useLoggedInUserData();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!loggedInUserData?.accessToken) {
      console.log("No access token, cannot connect to socket.");
      return;
    }

    console.log("Connecting to socket");
    socket = io.connect(wsUrl + "/notify", {
      query: {
        token: loggedInUserData.accessToken,
      },
    });

    socket.on("connect", () => {
      console.log("Socket connected!");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected!");
    });

    socket.on("reconnection_attempt", () => {
      console.log("Socket attempting reconnect!");
    });

    socket.on("reconnect", () => {
      console.log("Socket reconnected!");
    });

    socket.on("event://get-notification", (payload: Notification) => {
      dispatch(receiveNotification(payload));
    });

    return () => {
      console.log("Socket disconnecting");
      socket?.disconnect();
    };
  }, [loggedInUserData]);

  ws = {
    socket: socket,
  };

  return (
    <NotificationSocketContext.Provider value={ws}>
      {children}
    </NotificationSocketContext.Provider>
  );
};
