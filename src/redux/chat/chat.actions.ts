import {
  ADD_MESSAGES_TO_CHATROOM,
  ADD_ONLINE_USERS,
  CLEAR_CHAT_DATA,
  RECEIVE_MESSAGE,
  REMOVE_ONLINE_USERS,
  SET_CHATROOMS,
  SET_CHATROOM_READ,
  SET_CHATROOM_TYPING,
  SET_UNREAD_CHATS_COUNT,
  START_LOADING_CHATROOMS,
  START_LOADING_MESSAGES,
} from "./chat.actionTypes";
import {
  BecomeOnlineMessage,
  Chatroom,
  AddMessagesToChatroomPayload,
  ChatroomMessage,
  SetChatroomTypingPayload,
} from "../../types/ChatroomMessage";
import {
  getChatroomMessages,
  getMyChatrooms,
  getUnreadChatsCount,
} from "../../api/chat.api";
import {
  CursorPaginatedResponse,
  PaginatedResponse,
} from "../../types/PaginatedResponse";

export const startLoadingChats = () => {
  return {
    type: START_LOADING_CHATROOMS,
  };
};

export const setChatrooms = (chatrooms: Chatroom[]) => {
  return {
    type: SET_CHATROOMS,
    payload: chatrooms,
  };
};

export const fetchChatrooms = () => {
  return async function (dispatch: any) {
    dispatch(startLoadingChats());

    let chatrooms: Chatroom[] = [];

    try {
      chatrooms = await getMyChatrooms();
    } catch (e) {
      console.log(e);
    }

    dispatch(setChatrooms(chatrooms));
  };
};

export const startLoadingMessages = (chatroomId: string) => {
  return {
    type: START_LOADING_MESSAGES,
    payload: {
      chatroomId,
    },
  };
};

export const addMessagesToChatroom = (
  payload: AddMessagesToChatroomPayload
) => {
  return {
    type: ADD_MESSAGES_TO_CHATROOM,
    payload,
  };
};

export const fetchChatroomMessages = (
  chatroomId: string,
  cursor?: number | null
) => {
  if (cursor === null) {
    return;
  }

  return async function (dispatch: any) {
    let messages: CursorPaginatedResponse<ChatroomMessage> = {
      cursor: null,
      data: [],
    };

    try {
      messages = await getChatroomMessages(chatroomId, cursor);
    } catch (e) {
      console.log(e);
    }

    dispatch(
      addMessagesToChatroom({
        chatroomId,
        messages: messages.data,
        cursor: messages.cursor,
      })
    );
  };
};

export const addOnlineUsers = (
  messages: BecomeOnlineMessage[],
  currentUserId: string
) => {
  return {
    type: ADD_ONLINE_USERS,
    payload: {
      messages,
      currentUserId,
    },
  };
};

export const removeOnlineUsers = (
  messages: BecomeOnlineMessage[],
  currentUserId: string
) => {
  return {
    type: REMOVE_ONLINE_USERS,
    payload: {
      messages,
      currentUserId,
    },
  };
};

export const receiveMessage = (
  chatroomId: string,
  message: ChatroomMessage,
  currentUserId: string
) => {
  return {
    type: RECEIVE_MESSAGE,
    payload: {
      chatroomId,
      message,
      currentUserId,
    },
  };
};

export const fetchUnreadChatsCount = () => {
  return async function (dispatch: any) {
    try {
      const unreadCountF = await getUnreadChatsCount();
      dispatch(setUnreadChatsCount(unreadCountF.unreadCount));
    } catch (e) {
      console.log(e);
    }
  };
};

export const setUnreadChatsCount = (count: number) => {
  return {
    type: SET_UNREAD_CHATS_COUNT,
    payload: count,
  };
};

export const setChatroomRead = (
  chatroomId: string,
  userId: string,
  currentUserId: string
) => {
  return {
    type: SET_CHATROOM_READ,
    payload: {
      chatroomId,
      userId,
      currentUserId,
    },
  };
};

export const setChatroomTyping = (payload: SetChatroomTypingPayload) => {
  return {
    type: SET_CHATROOM_TYPING,
    payload,
  };
};

export const clearChatData = () => {
  return {
    type: CLEAR_CHAT_DATA,
  };
};
