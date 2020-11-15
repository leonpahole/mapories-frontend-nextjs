import {
  UpdateChatLogMessage,
  BecomeOnlineMessage,
  UpdateChatLogMessages,
} from "../../types/ChatroomMessage";

export const UPDATE_CHAT_LOG = "UPDATE_CHAT_LOG";
export const ADD_MESSAGES = "ADD_MESSAGES";
export const ADD_ONLINE_USERS = "ADD_ONLINE_USERS";
export const REMOVE_ONLINE_USERS = "REMOVE_ONLINE_USERS";

export interface UpdateChatLog {
  type: typeof UPDATE_CHAT_LOG;
  payload: UpdateChatLogMessage;
}

export interface AddMessages {
  type: typeof ADD_MESSAGES;
  payload: UpdateChatLogMessages;
}

export interface AddOnlineUsers {
  type: typeof ADD_ONLINE_USERS;
  payload: BecomeOnlineMessage[];
}

export interface RemoveOnlineUsers {
  type: typeof REMOVE_ONLINE_USERS;
  payload: BecomeOnlineMessage[];
}

export type ChatActionTypes =
  | UpdateChatLog
  | AddMessages
  | AddOnlineUsers
  | RemoveOnlineUsers;
