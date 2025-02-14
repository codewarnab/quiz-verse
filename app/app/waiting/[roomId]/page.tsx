"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";

export default function WaitingRoom() {
  const params = useParams();
  const roomId = params.roomId;
  const [clientRoomId, setClientRoomId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof roomId === 'string') {
      setClientRoomId(roomId);
    }
  }, [roomId]);
console.log(clientRoomId);
  // Fetch room details using the getRoom query
  const room = useQuery(api.rooms.getRoom, { roomId: clientRoomId ?? '' });
  if (!room) {
    return <div>Loading...</div>;
  }
  if(room)
  console.log("ROOM",room)
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="p-6 pb-2">
        <div className="text-sm mb-4">11:00</div>
        <h1 className="text-4xl font-bold">Waiting Room</h1>
      </header>
      {/* Main Content */}
      <main className="p-6">
        <h2 className="text-2xl mb-4">{room.name}</h2>
        Total members:
        <p>{room.participants.length}</p>
        {room.description && <p className="mb-4">{room.description}</p>}
        {room.quiz && (
          <>
            <h3 className="text-xl mb-2">Quiz: {room.quiz.title}</h3>
            <ul>
              {room.quiz.questions.map((question, index) => (
                <li key={index} className="mb-2">
                  <strong>Q{index + 1}:</strong> {question.question}
                  <ul className="ml-4">
                    {question.options.map((option, i) => (
                      <li key={i}>{option}</li>
                    ))}
                  </ul>
                  <p><strong>Answer:</strong> {question.answer}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}