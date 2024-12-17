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

export function useSocketChat(room: string, name?: string) {
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
    if (!name) return;
    socket.emit("join", { room, name });
    return () => {
      socket.disconnect();
      setChats([]);
    };
  }, [name, room, socket]);
  useEffect(() => {
    if (!name) return;
    function onChat(value: MessageResponse) {
      if (value.type !== "chat") return;
      const chatMessage = {
        sender: value.name,
        time: new Date().toLocaleTimeString().replace(/:\d\d /, " "),
        chat: value.value,
      };
      setChats((prev) => [...prev, chatMessage]);
    }

    function onJoin(value: string) {
      const joinMessage = {
        chat: `${value} has joined.`,
        sender: "Server",
        time: new Date().toLocaleTimeString().replace(/:\d\d /, " "),
      };
      setChats((prev) => [...prev, joinMessage]);
    }

    socket.on("join", onJoin);
    socket.on("message", onChat);
  }, [name, socket]);

  function sendMessage() {
    socket.emit("message", {
      type: "chat",
      name: name,
      value: inputValue,
    });
    setInputValue("");
  }
  const messageInputProps = {
    value: inputValue,
    onChange: (e: ChangeEvent<HTMLInputElement>) =>
      setInputValue(e.target.value),
  };
  return {
    messageInputProps,
    sendMessage,
    messages: chats,
  };
}
