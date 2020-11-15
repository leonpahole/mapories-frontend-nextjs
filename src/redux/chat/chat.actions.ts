import {
  UPDATE_CHAT_LOG,
  ADD_ONLINE_USERS,
  REMOVE_ONLINE_USERS,
  ADD_MESSAGES,
} from "./chat.actionTypes";
import {
  UpdateChatLogMessage,
  BecomeOnlineMessage,
  UpdateChatLogMessages,
} from "../../types/ChatroomMessage";
import { getChatroomMessages } from "../../api/chat.api";

export const fetchChatLog = (chatroomId: string, skip: number) => {
  return async function (dispatch: any) {
    const messages = await getChatroomMessages(chatroomId, skip);
    dispatch(
      addMessages({
        chatroomId,
        messages: messages.data,
        moreAvailable: messages.moreAvailable,
      })
    );
  };
};

export const addMessages = (messages: UpdateChatLogMessages) => {
  return {
    type: ADD_MESSAGES,
    payload: messages,
  };
};

export const updateChatLog = (message: UpdateChatLogMessage) => {
  return {
    type: UPDATE_CHAT_LOG,
    payload: message,
  };
};

export const addOnlineUsers = (messages: BecomeOnlineMessage[]) => {
  return {
    type: ADD_ONLINE_USERS,
    payload: messages,
  };
};

export const removeOnlineUsers = (messages: BecomeOnlineMessage[]) => {
  return {
    type: REMOVE_ONLINE_USERS,
    payload: messages,
  };
};
