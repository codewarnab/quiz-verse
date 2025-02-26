'use client';
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
    <div className="p-6 rounded-lg text-white text-center">
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId ?? ""}
        onChange={(e) => setRoomId(e.target.value)}
        className="px-4 py-2 border border-zinc-700 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition"
      />
      <button
        onClick={handleJoinRoom}
        className="ml-4 px-6 py-3 bg-green-700 text-white rounded-lg text-lg font-semibold hover:bg-green-600 transition"
      >
        Join
      </button>
    </div>
  );
}