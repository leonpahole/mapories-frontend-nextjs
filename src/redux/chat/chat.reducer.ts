import { Chatroom } from "../../types/ChatroomMessage";
import {
  ADD_MESSAGES_TO_CHATROOM,
  ADD_ONLINE_USERS,
  ChatActionTypes,
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

export interface ChatStateI {
  unreadCount: number;
  chatrooms: Chatroom[];
  loading: boolean;
  mostRecentMessageChatroom: { id: string; date: Date } | null;
}

const defaultState: ChatStateI = {
  unreadCount: 0,
  chatrooms: [],
  mostRecentMessageChatroom: null,
  loading: false,
};

const chatReducer = (
  state: ChatStateI = defaultState,
  action: ChatActionTypes
): ChatStateI => {
  switch (action.type) {
    case START_LOADING_CHATROOMS:
      return {
        ...state,
        loading: true,
      };

    case SET_CHATROOMS:
      return {
        ...state,
        loading: false,
        chatrooms: action.payload,
      };

    case START_LOADING_MESSAGES:
      const updatedLoadingChatrooms = state.chatrooms.map((c) => {
        if (c.id === action.payload.chatroomId) {
          return {
            ...c,
            messages: {
              ...c.messages,
              loading: true,
            },
          };
        }
        return c;
      });

      return {
        ...state,
        chatrooms: updatedLoadingChatrooms,
      };

    case ADD_MESSAGES_TO_CHATROOM:
      const updatedAddedMessageChatrooms = state.chatrooms.map((c) => {
        if (c.id === action.payload.chatroomId) {
          return {
            ...c,
            messages: {
              ...c.messages,
              data: [...action.payload.messages.reverse(), ...c.messages.data],
              cursor: action.payload.cursor,
              loading: false,
            },
          };
        }
        return c;
      });

      return {
        ...state,
        chatrooms: updatedAddedMessageChatrooms,
      };

    case ADD_ONLINE_USERS:
      const currUserIdOnline = action.payload.currentUserId;
      const updatedOnlineChatrooms = state.chatrooms.map((c) => {
        const online = action.payload.messages.filter(
          (cc) => cc.chatroomId === c.id
        );
        if (online.length > 0) {
          return {
            ...c,
            isOnline: online.some((o) => o.userId !== currUserIdOnline),
            participants: c.participants.map((p) => {
              if (online.some((o) => p.id === o.userId)) {
                return {
                  ...p,
                  isOnline: true,
                };
              }

              return p;
            }),
          };
        }
        return c;
      });

      return {
        ...state,
        chatrooms: updatedOnlineChatrooms,
      };

    case REMOVE_ONLINE_USERS:
      const currUserIdOffline = action.payload.currentUserId;
      const updatedOfflineChatrooms = state.chatrooms.map((c) => {
        const offline = action.payload.messages.filter(
          (cc) => cc.chatroomId === c.id
        );
        if (offline.length > 0) {
          const participants = c.participants.map((p) => {
            if (offline.some((o) => p.id === o.userId)) {
              return {
                ...p,
                isOnline: false,
              };
            }

            return p;
          });

          return {
            ...c,
            isOnline: participants.some(
              (p) => p.isOnline && p.id !== currUserIdOffline
            ),
            participants,
          };
        }
        return c;
      });

      return {
        ...state,
        chatrooms: updatedOfflineChatrooms,
      };

    case RECEIVE_MESSAGE:
      const currUserIdReceive = action.payload.currentUserId;
      const isMine = action.payload.message.sender.id === currUserIdReceive;

      const updatedReceiveMessageChatrooms = state.chatrooms.map((c) => {
        if (c.id === action.payload.chatroomId) {
          return {
            ...c,
            isUnread: !isMine,
            participants: c.participants.map((p) => {
              return {
                ...p,
                isUnread: p.id !== action.payload.message.sender.id,
              };
            }),
            messages: {
              ...c.messages,
              data: [...c.messages.data, action.payload.message],
            },
          };
        }

        return c;
      });

      return {
        ...state,
        chatrooms: updatedReceiveMessageChatrooms,
        unreadCount: isMine ? state.unreadCount : state.unreadCount + 1,
        mostRecentMessageChatroom: {
          id: action.payload.chatroomId,
          date: new Date(),
        },
      };

    case SET_UNREAD_CHATS_COUNT:
      return {
        ...state,
        unreadCount: Math.max(0, action.payload),
      };

    case SET_CHATROOM_READ:
      const currUserIdRead = action.payload.currentUserId;
      const isMineRead = action.payload.userId === currUserIdRead;

      const updatedReadChatrooms = state.chatrooms.map((c) => {
        if (c.id === action.payload.chatroomId) {
          return {
            ...c,
            isUnread: !isMineRead,
            participants: c.participants.map((p) => {
              return {
                ...p,
                isUnread: p.isUnread || p.id === action.payload.userId,
              };
            }),
          };
        }
        return c;
      });

      return {
        ...state,
        chatrooms: updatedReadChatrooms,
        unreadCount: isMineRead
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount,
      };

    case SET_CHATROOM_TYPING:
      const updatedTypingChatrooms = state.chatrooms.map((c) => {
        if (c.id === action.payload.chatroomId) {
          return {
            ...c,
            participants: c.participants.map((p) => {
              return {
                ...p,
                isTyping: p.isUnread || p.id === action.payload.userId,
              };
            }),
          };
        }
        return c;
      });

      return {
        ...state,
        chatrooms: updatedTypingChatrooms,
      };

    case CLEAR_CHAT_DATA:
      return {
        ...defaultState,
      };

    default:
      return state;
  }
};

export default chatReducer;
