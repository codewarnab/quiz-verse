"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function JoinRoomButton() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const joinRoom = useMutation(api.rooms.joinRoom);
  const router = useRouter();

  const handleJoinRoom = async () => {
    if (!roomId) {
      alert("Please enter a room ID");
      return;
    }

    try {
      const newRoomId = await joinRoom({ roomId });
      router.push(`/app/waiting/${newRoomId}`);
    } catch (error) {
      console.error("Failed to join room:", error);
      alert("Failed to join room. Please check the room ID and try again.");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId ?? ""}
        onChange={(e) => setRoomId(e.target.value)}
        className="px-4 py-2 border rounded-md"
      />
      <button
        onClick={handleJoinRoom}
        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Join
      </button>
    </div>
  );
}