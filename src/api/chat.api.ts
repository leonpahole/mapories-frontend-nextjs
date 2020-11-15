import { api } from "./api";
import {
  IChatroom,
  Chatroom,
  convertIChatroomsToChatrooms,
  ChatroomMessage,
} from "../types/ChatroomMessage";
import { PaginatedResponse } from "../types/PaginatedResponse";

export const getMyIChatrooms = async (): Promise<IChatroom[]> => {
  const res = await api.get<IChatroom[]>(`chat/rooms`);
  return res.data;
};

export const getMyChatrooms = async (
  currentUserId: string
): Promise<Chatroom[]> => {
  const iChatrooms = await getMyIChatrooms();
  return convertIChatroomsToChatrooms(iChatrooms, currentUserId);
};

export const getChatroomMessages = async (
  id: string,
  skip: number,
  pageSize: number = 10
): Promise<PaginatedResponse<ChatroomMessage>> => {
  const res = await api.get<PaginatedResponse<ChatroomMessage>>(
    `chat/rooms/${id}/messages?skip=${skip}&pageSize=${pageSize}`
  );
  return res.data;
};
