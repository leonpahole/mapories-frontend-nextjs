import {
  AddMessagesToChatroomPayload,
  BecomeOnlineMessage,
  Chatroom,
  ReceiveMessagePayload,
  SetChatroomTypingPayload,
} from "../../types/ChatroomMessage";

export const START_LOADING_CHATROOMS = "START_LOADING_CHATROOMS";
export const SET_CHATROOMS = "SET_CHATROOMS";
export const START_LOADING_MESSAGES = "START_LOADING_MESSAGES";
export const ADD_MESSAGES_TO_CHATROOM = "ADD_MESSAGES_TO_CHATROOM";
export const ADD_ONLINE_USERS = "ADD_ONLINE_USERS";
export const REMOVE_ONLINE_USERS = "REMOVE_ONLINE_USERS";
export const RECEIVE_MESSAGE = "RECEIVE_MESSAGE";
export const SET_UNREAD_CHATS_COUNT = "SET_UNREAD_CHATS_COUNT";
export const SET_CHATROOM_READ = "SET_CHATROOM_READ";
export const SET_CHATROOM_TYPING = "SET_CHATROOM_TYPING";
export const CLEAR_CHAT_DATA = "CLEAR_CHAT_DATA";

export interface StartLoadingChatrooms {
  type: typeof START_LOADING_CHATROOMS;
}

export interface SetChatrooms {
  type: typeof SET_CHATROOMS;
  payload: Chatroom[];
}

export interface StartLoadingMessages {
  type: typeof START_LOADING_MESSAGES;
  payload: { chatroomId: string };
}

export interface AddMessagesToChatroom {
  type: typeof ADD_MESSAGES_TO_CHATROOM;
  payload: AddMessagesToChatroomPayload;
}

export interface AddOnlineUsers {
  type: typeof ADD_ONLINE_USERS;
  payload: { messages: BecomeOnlineMessage[]; currentUserId: string };
}

export interface RemoveOnlineUsers {
  type: typeof REMOVE_ONLINE_USERS;
  payload: { messages: BecomeOnlineMessage[]; currentUserId: string };
}

export interface ReceiveMessage {
  type: typeof RECEIVE_MESSAGE;
  payload: ReceiveMessagePayload;
}

export interface SetUnreadChatsCount {
  type: typeof SET_UNREAD_CHATS_COUNT;
  payload: number;
}

export interface SetChatroomRead {
  type: typeof SET_CHATROOM_READ;
  payload: { chatroomId: string; userId: string; currentUserId: string };
}

export interface SetChatroomTyping {
  type: typeof SET_CHATROOM_TYPING;
  payload: SetChatroomTypingPayload;
}

export interface ClearChatData {
  type: typeof CLEAR_CHAT_DATA;
}

export type ChatActionTypes =
  | StartLoadingChatrooms
  | SetChatrooms
  | StartLoadingMessages
  | AddMessagesToChatroom
  | AddOnlineUsers
  | RemoveOnlineUsers
  | ReceiveMessage
  | SetUnreadChatsCount
  | SetChatroomRead
  | SetChatroomTyping
  | ClearChatData;
