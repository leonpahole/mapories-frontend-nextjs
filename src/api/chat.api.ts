import { api } from "./api";
import {
  IChatroom,
  Chatroom,
  convertIChatroomsToChatrooms,
  ChatroomMessage,
} from "../types/ChatroomMessage";
import {
  CursorPaginatedResponse,
  PaginatedResponse,
} from "../types/PaginatedResponse";

export const getUnreadChatsCount = async (): Promise<{
  unreadCount: number;
}> => {
  const res = await api.get<{ unreadCount: number }>(`chat/unreadCount`);
  return res.data;
};

export const getMyIChatrooms = async (): Promise<IChatroom[]> => {
  const res = await api.get<IChatroom[]>(`chat/rooms`);
  return res.data;
};

export const getMyChatrooms = async (): Promise<Chatroom[]> => {
  const iChatrooms = await getMyIChatrooms();
  return convertIChatroomsToChatrooms(iChatrooms);
};

export const getChatroomMessages = async (
  id: string,
  cursor?: number,
  pageSize: number = 10
): Promise<CursorPaginatedResponse<ChatroomMessage>> => {
  const res = await api.get<CursorPaginatedResponse<ChatroomMessage>>(
    `chat/rooms/${id}/messages?pageSize=${pageSize}${
      cursor ? `&cursor=${cursor}` : ""
    }`
  );
  return res.data;
};
