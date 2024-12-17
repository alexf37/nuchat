"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomName, setRoomName] = useState("");
  const router = useRouter();

  return (
    <main className="container mx-auto flex h-full flex-col items-center justify-center gap-4 px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold">NuChat</h1>
      </div>
      <form
        className="flex flex-col items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const room = roomName.trim();
          if (!room) {
            toast.error("Please enter a room name");
            return;
          }
          if (!/[A-Za-z0-9]+/.test(room)) {
            toast.error("Room name can only contain letters and numbers");
            return;
          }
          router.push(`/room/${room}`);
          toast.success(`Joined room "${roomName}"`);
        }}
      >
        <Input
          placeholder="Room Code"
          value={roomName}
          onChange={(e) => {
            setRoomName(e.target.value);
          }}
        ></Input>
        <Button type="submit" className="w-full" outline>
          Join Room
        </Button>
      </form>
    </main>
  );
}
