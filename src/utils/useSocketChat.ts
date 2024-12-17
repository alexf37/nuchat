import { io } from "socket.io-client";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

const CHAT_SERVER = "https://connect.xsschat.com";

type Message = {
  sender: string;
  time: string;
  chat: string;
};

type MessageResponse = {
  type: string;
  name: string;
  value: string;
};

export function useSocketChat(room: string, name: string) {
  const { current: socket } = useRef(
    io(CHAT_SERVER, {
      autoConnect: false,
    }),
  );

  const [inputValue, setInputValue] = useState("");
  const [chats, setChats] = useState<Message[]>([]);

  useEffect(() => {
    socket.disconnect();
    socket.connect();
    socket.emit("join", { room, name });
    return () => {
      socket.disconnect();
      setChats([]);
    };
  }, [room, name, socket]);

  useEffect(() => {
    function handleChatMessage(message: MessageResponse) {
      if (message.type !== "chat") return;
      const chatMessage: Message = {
        sender: message.name,
        time: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "numeric",
        }),
        chat: message.value,
      };
      setChats((prevChats) => [...prevChats, chatMessage]);
    }

    function handleUserJoin(joinedUserName: string) {
      const joinMessage: Message = {
        sender: "Server",
        time: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "numeric",
        }),
        chat: `${joinedUserName} has joined.`,
      };
      setChats((prevChats) => [...prevChats, joinMessage]);
    }

    socket.on("message", handleChatMessage);
    socket.on("join", handleUserJoin);

    return () => {
      socket.off("message", handleChatMessage);
      socket.off("join", handleUserJoin);
    };
  }, [socket]);

  function sendMessage() {
    if (inputValue.trim() === "") return;
    socket.emit("message", {
      type: "chat",
      name,
      value: inputValue,
    });
    setInputValue("");
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  return {
    messageInputProps: {
      value: inputValue,
      onChange: handleInputChange,
    },
    sendMessage,
    messages: chats,
  };
}
