import {
  NotificationActionTypes,
  ADD_NOTIFICATIONS,
  RECEIVE_NOTIFICATION,
  SET_NOTIFICATION_READ,
  SET_UNREAD_NOTIFICATION_COUNT,
  START_LOADING_NOTIFICATIONS,
  CLEAR_NOTIFICATION_DATA,
} from "./notification.actionTypes";
import { Notification } from "../../types/Notification";

export interface NotificationStateI {
  unreadCount: number;
  notifications: Notification[];
  moreAvailable: boolean;
  mostRecentNotification: Notification | null;
  loading: boolean;
}

const defaultState: NotificationStateI = {
  unreadCount: 0,
  notifications: [],
  moreAvailable: false,
  mostRecentNotification: null,
  loading: false,
};

const notificationReducer = (
  state: NotificationStateI = defaultState,
  action: NotificationActionTypes
): NotificationStateI => {
  switch (action.type) {
    case START_LOADING_NOTIFICATIONS:
      return {
        ...state,
        loading: true,
      };

    case ADD_NOTIFICATIONS:
      return {
        ...state,
        moreAvailable: action.payload.moreAvailable,
        notifications: [
          ...state.notifications,
          ...action.payload.notifications,
        ],
        loading: false,
      };

    case RECEIVE_NOTIFICATION:
      return {
        ...state,
        mostRecentNotification: action.payload,
        unreadCount: state.unreadCount + 1,
      };

    case SET_UNREAD_NOTIFICATION_COUNT:
      return {
        ...state,
        unreadCount: Math.max(0, action.payload),
      };

    case SET_NOTIFICATION_READ:
      const updatedNotifications = state.notifications.map((n) => {
        if (n.id === action.payload) {
          return {
            ...n,
            read: true,
          };
        }

        return n;
      });

      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: Math.max(0, state.unreadCount - 1),
      };

    case CLEAR_NOTIFICATION_DATA:
      return {
        ...defaultState,
      };

    default:
      return state;
  }
};

export default notificationReducer;
