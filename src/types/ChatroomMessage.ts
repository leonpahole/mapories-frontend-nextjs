import { UserExcerpt } from "./UserExcerpt";

// comes from api
export type IChatroom = {
  id: string;
  name: string | null;
  lastMessagedAt: Date | null;
  participants: UserExcerpt[];
};

// ready for use in chatroom list
export type Chatroom = {
  id: string;
  name: string;
  isUnread: boolean;
  lastMessagedAt: Date | null;
  participant?: UserExcerpt;
  participants?: UserExcerpt[];
};

export const convertIChatroomsToChatrooms = (
  iChatrooms: IChatroom[],
  currentUserId: string
): Chatroom[] => {
  return iChatrooms.map((c) => convertIChatroomToChatroom(c, currentUserId));
};

export const convertIChatroomToChatroom = (
  iChatroom: IChatroom,
  currentUserId: string
): Chatroom => {
  const chatroom: Chatroom = {
    id: iChatroom.id,
    isUnread: false,
    name: iChatroom.name || "",
    lastMessagedAt: iChatroom.lastMessagedAt,
  };

  if (iChatroom.participants.length > 2) {
    chatroom.participants = iChatroom.participants.filter(
      (p) => p.id !== currentUserId
    );

    if (chatroom.name.length === 0) {
      chatroom.name = chatroom.participants.map((p) => p.name).join(", ");
    }
  } else {
    chatroom.participant = iChatroom.participants.find(
      (p) => p.id !== currentUserId
    );

    if (chatroom.name.length === 0) {
      chatroom.name = chatroom.participant!.name;
    }
  }

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

export type UpdateChatLogMessages = {
  chatroomId: string;
  messages: ChatroomMessage[];
  moreAvailable: boolean;
};

export type BecomeOnlineMessage = {
  userId: string;
  chatroomId: string;
};
