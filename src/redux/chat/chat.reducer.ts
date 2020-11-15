import {
  ChatActionTypes,
  UPDATE_CHAT_LOG,
  REMOVE_ONLINE_USERS,
  ADD_ONLINE_USERS,
  ADD_MESSAGES,
} from "./chat.actionTypes";
import { ChatroomMessage } from "../../types/ChatroomMessage";
import { act } from "@testing-library/react";

export interface RoomStateI {
  moreAvailable: boolean;
  chatroomId: string;
  messages: ChatroomMessage[];
}

export interface RoomOnlineStatus {
  chatroomId: string;
  usersOnline: string[];
}

export interface ChatStateI {
  rooms: RoomStateI[];
  onlineChatrooms: RoomOnlineStatus[];
  lastMessageChatroom: {
    id: string;
    date: Date;
  } | null;
}

const defaultState: ChatStateI = {
  rooms: [],
  onlineChatrooms: [],
  lastMessageChatroom: null,
};

const chatReducer = (
  state: ChatStateI = defaultState,
  action: ChatActionTypes
): ChatStateI => {
  switch (action.type) {
    case ADD_ONLINE_USERS:
      const newChatrooms = state.onlineChatrooms.slice();
      action.payload.forEach((c) => {
        const chatroom = newChatrooms.find(
          (nc) => nc.chatroomId === c.chatroomId
        );

        if (chatroom) {
          const existingUser = chatroom.usersOnline.find((u) => u === c.userId);
          if (!existingUser) {
            chatroom.usersOnline.push(c.userId);
          }
        } else {
          newChatrooms.push({
            chatroomId: c.chatroomId,
            usersOnline: [c.userId],
          });
        }
      });

      return {
        ...state,
        onlineChatrooms: newChatrooms,
      };

    case REMOVE_ONLINE_USERS:
      const newChatroomsD = state.onlineChatrooms.slice();
      action.payload.forEach((c) => {
        const chatroom = newChatroomsD.find(
          (nc) => nc.chatroomId === c.chatroomId
        );

        console.log(chatroom);

        if (chatroom) {
          chatroom.usersOnline = chatroom.usersOnline.filter(
            (u) => u !== c.userId
          );
        }
      });

      return {
        ...state,
        onlineChatrooms: newChatroomsD.filter((c) => c.usersOnline.length > 0),
      };

    case UPDATE_CHAT_LOG:
      if (state.rooms.some((r) => r.chatroomId === action.payload.chatroomId)) {
        const newRooms = state.rooms.map((r) => {
          if (r.chatroomId !== action.payload.chatroomId) {
            return r;
          }

          return {
            ...r,
            messages: [...r.messages, action.payload.message],
          };
        });

        return {
          ...state,
          rooms: newRooms,
          lastMessageChatroom: {
            id: action.payload.chatroomId,
            date: new Date(),
          },
        };
      } else {
        return {
          ...state,
          rooms: [
            ...state.rooms,
            {
              moreAvailable: true,
              chatroomId: action.payload.chatroomId,
              messages: [action.payload.message],
            },
          ],
          lastMessageChatroom: {
            id: action.payload.chatroomId,
            date: new Date(),
          },
        };
      }

    case ADD_MESSAGES:
      if (state.rooms.some((r) => r.chatroomId === action.payload.chatroomId)) {
        const newRooms = state.rooms.map(
          (r): RoomStateI => {
            if (r.chatroomId !== action.payload.chatroomId) {
              return r;
            }

            return {
              ...r,
              moreAvailable: action.payload.moreAvailable,
              messages: [...action.payload.messages, ...r.messages],
            };
          }
        );

        return {
          ...state,
          rooms: newRooms,
        };
      } else {
        return {
          ...state,
          rooms: [
            ...state.rooms,
            {
              moreAvailable: action.payload.moreAvailable,
              chatroomId: action.payload.chatroomId,
              messages: action.payload.messages,
            },
          ],
        };
      }
    default:
      return state;
  }
};

export default chatReducer;
