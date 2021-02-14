import { UserExcerpt } from "./UserExcerpt";

// comes from api
export type IChatroom = {
  id: string;
  name: string;
  participants: ChatroomParticipant[];
  isUnread: boolean;
};

export type ChatroomParticipant = UserExcerpt & {
  isOnline: boolean;
  isTyping: boolean;
  isUnread: boolean;
};

// ready for use in chatroom list
export interface Chatroom {
  id: string;
  name: string;
  isUnread: boolean;
  isOnline: boolean;
  participants: ChatroomParticipant[];
  messages: {
    loading: boolean;
    cursor?: number | null;
    data: ChatroomMessage[];
  };
}

export const convertIChatroomsToChatrooms = (
  iChatrooms: IChatroom[]
): Chatroom[] => {
  return iChatrooms.map((c) => convertIChatroomToChatroom(c));
};

export const convertIChatroomToChatroom = (iChatroom: IChatroom): Chatroom => {
  const chatroom: Chatroom = {
    id: iChatroom.id,
    name: iChatroom.name,
    isUnread: iChatroom.isUnread,
    isOnline: false,
    participants: iChatroom.participants,
    messages: {
      loading: false,
      cursor: undefined,
      data: [],
    },
  };

  return chatroom;
};

export type ChatroomMessage = {
  createdAt: Date;
  sender: UserExcerpt;
  content: string;
};

export type UpdateChatLogMessage = {
  chatroomId: string;
  message: ChatroomMessage;
};

export type AddMessagesToChatroomPayload = {
  chatroomId: string;
  messages: ChatroomMessage[];
  cursor: number | null | undefined;
};

export type BecomeOnlineMessage = {
  userId: string;
  chatroomId: string;
};

export type ReceiveMessagePayload = {
  chatroomId: string;
  message: ChatroomMessage;
  currentUserId: string;
};

export type SetChatroomTypingPayload = {
  chatroomId: string;
  userId: string;
  typing: boolean;
};
