"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { Users, Share2, Copy } from "lucide-react"

export default function WaitingRoom() {
  const params = useParams();
  const roomId = params.roomId;
  const [clientRoomId, setClientRoomId] = useState<string | null>(null);
  const getParticipantsOfRoom = useQuery(api.rooms.getParticipantsInRoom, { roomId: clientRoomId ?? '' });
  useEffect(() => {
    if (typeof roomId === 'string') {
      setClientRoomId(roomId);
    }
  }, [roomId]);
  console.log(clientRoomId);
  // Fetch room details using the getRoom query
  const room = useQuery(api.rooms.getRoom, { roomId: clientRoomId ?? '' });

  const copyRoomId = () => {
    if (clientRoomId) {
      navigator.clipboard.writeText(clientRoomId)
    }
  }
  if (!room) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }
  let spacesLeft = 0;
  if (room && room.settings) {
    spacesLeft = (room.settings.maxParticipants ?? 0) - (room.participants?.length ?? 0);
  }
  console.log("ROOM", room, "PARTICIPANTS", getParticipantsOfRoom);

  return (
    <div className="min-h-screen bg-black text-white">
    {/* Header */}
    <header className="p-4 border-b border-green-800">
      <h1 className="text-2xl font-bold mb-4">Waiting Room</h1>

      {/* Room Sharing Section */}
      <div className="bg-[#0F1F18] rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 text-green-400 mb-2">
          <Share2 className="w-4 h-4" />
          <span className="text-sm">Share Room with Friends</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#b8dcb35a] rounded px-3 py-1.5 flex-1 font-mono text-xs overflow-hidden">
            {clientRoomId}
          </div>
          <button
            onClick={copyRoomId}
            className="p-1.5 bg-[#0F1F18] rounded-lg"
            title="Copy Room ID"
          >
            <Copy className="w-4 h-4 text-green-400" />
          </button>
        </div>
      </div>
    </header>

    {/* Main Content */}
    <main className="p-4 space-y-6">
      {/* Quiz Info */}
      <div className="bg-[#0F1F18] rounded-lg p-4 space-y-3">
        <div>
          <h2 className="text-xl font-semibold text-green-400">{room.name}</h2>
          <p className="text-sm text-gray-400">Hosted by {room.hostedBy}</p>
        </div>
        {room.quiz.description && (
          <p className="text-sm text-gray-400">{room.quiz.description}</p>
        )}

        {/* Participants Count */}
        <div className=" bg-[#b8dcb35a] rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-green-400">
              <Users className="w-4 h-4" />
              <span className="text-sm">{room.participants?.length ?? 0} participants</span>
            </div>
            <span className="text-xs text-gray-400">{spacesLeft} spaces left</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-black rounded-full h-1.5">
            <div
              className="bg-green-400 h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${(room.participants?.length ?? 0) / (room.settings?.maxParticipants ?? 1) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Participants List */}
      <div>
        <h2 className="text-lg font-semibold text-green-400 mb-3">Participants</h2>
        <div className="space-y-2">
          {getParticipantsOfRoom?.map((participant, index) => (
            <div
              key={index}
              className="bg-[#1A1A1A] rounded-lg p-3 flex items-center gap-3"
            >
              <div className="relative">
                <img
                  src={participant.imageUrl || "/placeholder.svg"}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border border-green-400/20"
                />
                <div
                  className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-black
                  ${participant.status === "ready" ? "bg-green-400" : "bg-gray-400"}`}
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-green-50">{participant.name}</h3>
                <p className="text-xs text-gray-400 capitalize">{participant.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Waiting message */}
      <p className="text-gray-500 text-sm text-center">Waiting for more..</p>

      {/* Start Quiz Button */}
      <button className="bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg w-full text-sm font-medium">
        Start Quiz
      </button>
    </main>
    </div>
  )
}