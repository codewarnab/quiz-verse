'use client';

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function CreateRoomButton() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const createRoom = useMutation(api.rooms.createRoom);

  const handleCreateRoom = async () => {
    const newRoomId = await createRoom({
      name: "My Quiz Room",
      description: "This is a quiz room",
      quiz: {
        title: "Sample Quiz",
        questions: [
          {
            question: "What is 2 + 2?",
            options: ["1", "2", "3", "4"],
            answer: "4"
          },
          {
            question: "What is 3 + 3?",
            options: ["5", "6", "7", "8"],
            answer: "6"
          }
        ]
      }
    });
    setRoomId(newRoomId);
  };

  return (
    <div>
      {roomId ? (
        <>
        <p>
          Room created! Room ID: {roomId}
        </p>
        <Link href={`/app/waiting/${roomId}`}>
          <p className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Go to Waiting Room
          </p>
        </Link>
        </>
      ) : (
        <button 
          onClick={handleCreateRoom}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Create Room
        </button>
      )}

    </div>
  );
}