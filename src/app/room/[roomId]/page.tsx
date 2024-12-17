"use client";
import { twMerge } from "tailwind-merge";
import { useSocketChat } from "@/utils/useSocketChat";
import { useEffect, useRef, use } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Message = {
  sender: string;
  time: string;
  chat: string;
};

function ChatBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return (
    <div
      className={twMerge(
        isOwn
          ? "ml-auto bg-slate-50 text-zinc-800"
          : "bg-zinc-800 text-zinc-50",
        "w-9/12 max-w-fit space-y-1 break-words rounded-lg p-4 shadow",
      )}
    >
      <h3
        className={twMerge(
          "flex flex-row items-center gap-1 text-xs text-zinc-50",
          isOwn && "text-zinc-800",
        )}
      >
        {`${message.sender} · ${message.time}`}
      </h3>
      <p className="text-sm">{message.chat}</p>
    </div>
  );
}

function ChatBox({ room }: { room: string }) {
  const username = "alex";

  const { messages, sendMessage, messageInputProps } = useSocketChat(
    room,
    username,
  );
  const chatBoxDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBoxDiv.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  return (
    <>
      <div className="no-scrollbar h-full w-full space-y-3 overflow-auto py-4">
        {messages.map((chat, idx) => (
          <ChatBubble
            key={idx}
            message={chat}
            isOwn={chat.sender === username}
          />
        ))}
        <div className="h-0 w-0" ref={chatBoxDiv}></div>
      </div>
      <form
        className="flex items-center gap-2 pt-2"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <Input
          required
          placeholder="Say something..."
          type="text"
          {...messageInputProps}
          minLength={1}
          maxLength={280}
        />
        <Button type="submit">Send</Button>
      </form>
    </>
  );
}

export default function RoomPage({
  params,
}: {
  params: Promise<{
    roomId: string;
  }>;
}) {
  const { roomId } = use(params);
  return (
    <div className="mx-auto flex h-full w-full max-w-screen-lg flex-col p-8">
      <ChatBox room={roomId} />
    </div>
  );
}
