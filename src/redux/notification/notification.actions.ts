import {
  SET_NOTIFICATION_READ,
  SET_UNREAD_NOTIFICATION_COUNT,
  ADD_NOTIFICATIONS,
  RECEIVE_NOTIFICATION,
  START_LOADING_NOTIFICATIONS,
  CLEAR_NOTIFICATION_DATA,
} from "./notification.actionTypes";
import {
  getNotifications,
  getUnreadNotificationsCount,
} from "../../api/notification.api";
import { AddNotificatonsData, Notification } from "../../types/Notification";
import {
  CursorPaginatedResponse,
  PaginatedResponse,
} from "../../types/PaginatedResponse";

export const fetchUnreadNotificationCount = () => {
  return async function (dispatch: any) {
    try {
      const unreadCountF = await getUnreadNotificationsCount();
      dispatch(setUnreadNotificationCount(unreadCountF.notificationCount));
    } catch (e) {
      console.log(e);
    }
  };
};

export const fetchNotifications = (cursor?: number | null) => {
  if (cursor === null) {
    return;
  }

  return async function (dispatch: any) {
    dispatch(startLoadingNotifications());

    let notifications: CursorPaginatedResponse<Notification> = {
      cursor: null,
      data: [],
    };

    try {
      notifications = await getNotifications(cursor);
    } catch (e) {
      console.log(e);
    }

    dispatch(
      addNotifications({
        notifications: notifications.data,
        cursor: notifications.cursor,
      })
    );
  };
};

export const startLoadingNotifications = () => {
  return {
    type: START_LOADING_NOTIFICATIONS,
  };
};

export const addNotifications = (paginationData: AddNotificatonsData) => {
  return {
    type: ADD_NOTIFICATIONS,
    payload: paginationData,
  };
};

export const receiveNotification = (notification: Notification) => {
  return {
    type: RECEIVE_NOTIFICATION,
    payload: notification,
  };
};

export const setUnreadNotificationCount = (count: number) => {
  return {
    type: SET_UNREAD_NOTIFICATION_COUNT,
    payload: count,
  };
};

export const setNotificationRead = (id: string) => {
  return {
    type: SET_NOTIFICATION_READ,
    payload: id,
  };
};

export const clearNotificationData = () => {
  return {
    type: CLEAR_NOTIFICATION_DATA,
  };
};
