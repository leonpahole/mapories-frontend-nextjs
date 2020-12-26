import { Notification, AddNotificatonsData } from "../../types/Notification";

export const START_LOADING_NOTIFICATIONS = "START_LOADING_NOTIFICATIONS";
export const ADD_NOTIFICATIONS = "ADD_NOTIFICATIONS";
export const RECEIVE_NOTIFICATION = "RECEIVE_NOTIFICATION";
export const SET_UNREAD_NOTIFICATION_COUNT = "SEND_NOTIFICATION_COUNT";
export const SET_NOTIFICATION_READ = "SET_NOTIFICATION_READ";
export const CLEAR_NOTIFICATION_DATA = "CLEAR_NOTIFICATION_DATA";

export interface StartLoadingNotifications {
  type: typeof START_LOADING_NOTIFICATIONS;
}

export interface AddNotifications {
  type: typeof ADD_NOTIFICATIONS;
  payload: AddNotificatonsData;
}

export interface ReceiveNotification {
  type: typeof RECEIVE_NOTIFICATION;
  payload: Notification;
}

export interface SetUnreadNotificationCount {
  type: typeof SET_UNREAD_NOTIFICATION_COUNT;
  payload: number;
}

export interface SetNotificationRead {
  type: typeof SET_NOTIFICATION_READ;
  payload: string;
}

export interface ClearNotificationData {
  type: typeof CLEAR_NOTIFICATION_DATA;
}

export type NotificationActionTypes =
  | StartLoadingNotifications
  | AddNotifications
  | ReceiveNotification
  | SetUnreadNotificationCount
  | SetNotificationRead
  | ClearNotificationData;
