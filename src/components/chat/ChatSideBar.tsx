import React, { useState, useEffect } from "react";
import ChatroomsList from "./ChatroomsList";
import ChatWindow from "./ChatWindow";
import ChatBubbles from "./ChatBubbles";
import { Chatroom } from "../../types/ChatroomMessage";
import { useSelector } from "react-redux";
import { RootStore } from "../../redux/store";
import { getMyChatrooms } from "../../api/chat.api";
import { useLoggedInUser } from "../../hooks/useLoggedInUser";

const MAX_CHAT_WINDOWS = 2;

const ChatSideBar: React.FC = () => {
  const [chatBubbles, setChatBubbles] = useState<Chatroom[]>([]);
  const [chatWindows, setChatWindows] = useState<Chatroom[]>([]);

  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [loadingChatrooms, setLoadingChatrooms] = useState<boolean>(true);

  const loggedInUser = useLoggedInUser();

  useEffect(() => {
    async function fetchChatrooms() {
      try {
        const chatroomsF = await getMyChatrooms(loggedInUser!.id);
        setChatrooms(chatroomsF);
      } catch (e) {
        console.log(e);
      }

      setLoadingChatrooms(false);
    }

    fetchChatrooms();
  }, []);

  const lastMessageChatroom = useSelector(
    (state: RootStore) => state.chats.lastMessageChatroom
  );

  useEffect(() => {
    if (!lastMessageChatroom) {
      return;
    }

    const chatroom = chatrooms.find((c) => c.id === lastMessageChatroom.id);
    if (!chatroom) {
      return;
    }

    const existingBubble = chatBubbles.find((c) => c.id === chatroom.id);
    if (existingBubble) {
      if (!existingBubble.isUnread) {
        setChatBubbles((bubbles) =>
          bubbles.map((b) => {
            if (b.id === chatroom.id) {
              return {
                ...b,
                isUnread: true,
              };
            }

            return b;
          })
        );
      }

      return;
    }

    const windowExists = chatWindows.some((c) => c.id === chatroom.id);
    if (windowExists) {
      return;
    }

    if (chatWindows.length >= MAX_CHAT_WINDOWS) {
      setChatBubbles([{ ...chatroom, isUnread: true }, ...chatBubbles]);
    } else {
      setChatWindows([chatroom, ...chatWindows]);
    }
  }, [lastMessageChatroom]);

  const onChatroomClick = (chatroom: Chatroom) => {
    const existingWindow = chatWindows.find((w) => w.id === chatroom.id);

    if (existingWindow) {
      return;
    }

    const existingBubble = chatBubbles.find((w) => w.id === chatroom.id);
    let newChatBubbles = chatBubbles;
    let chatBubblesChanged = false;
    if (existingBubble) {
      newChatBubbles = chatBubbles.filter((w) => w.id !== chatroom.id);
      chatBubblesChanged = true;
    }

    if (chatWindows.length >= MAX_CHAT_WINDOWS) {
      const removedWindow = chatWindows[chatWindows.length - 1];
      newChatBubbles = [removedWindow, ...newChatBubbles];
      chatBubblesChanged = true;
      setChatWindows((windows) => [
        chatroom,
        ...windows.slice(0, windows.length - 1),
      ]);
    } else {
      setChatWindows([chatroom, ...chatWindows]);
    }

    if (chatBubblesChanged) {
      setChatBubbles(newChatBubbles);
    }
  };

  const onChatWindowMinimize = (chatroom: Chatroom) => {
    onChatWindowClose(chatroom);
    setChatBubbles([chatroom, ...chatBubbles]);
  };

  const onChatWindowClose = (chatroom: Chatroom) => {
    const newWindows = chatWindows.filter((w) => w.id !== chatroom.id);
    setChatWindows(newWindows);
  };

  const onChatBubbleOpen = (chatroom: Chatroom) => {
    onChatroomClick({ ...chatroom, isUnread: false });
  };

  const onChatBubbleClose = (chatroom: Chatroom) => {
    const newChatBubbles = chatBubbles.filter((w) => w.id !== chatroom.id);
    setChatBubbles(newChatBubbles);
  };

  return (
    <>
      {chatWindows.map((c, i) => (
        <ChatWindow
          index={i}
          chatroom={c}
          onMinimize={() => onChatWindowMinimize(c)}
          onClose={() => onChatWindowClose(c)}
        />
      ))}
      <ChatBubbles
        chatrooms={chatBubbles}
        onOpen={onChatBubbleOpen}
        onClose={onChatBubbleClose}
      />
      <ChatroomsList
        chatrooms={chatrooms}
        loadingChatrooms={loadingChatrooms}
        onChatroomClick={onChatroomClick}
      />
    </>
  );
};

export default ChatSideBar;
