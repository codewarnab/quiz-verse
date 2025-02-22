"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import Image from "next/image";
import { Share2, Copy, Users, X } from "lucide-react";
import RoomInfo from "@/components/Room Components/RoomInfo";
import RoomSettingsForm from "@/components/Room Components/RoomSettingsForm";

export default function WaitingRoom() {
  const params = useParams();
  const roomId = params.roomId;
  const router = useRouter();
  const { user } = useUser();
  const deleteRoom = useMutation(api.rooms.deleteRoom);

  const [clientRoomId, setClientRoomId] = useState<string | null>(null);

  const userDetails = useQuery(api.user.getUser, {
    clerkId: user?.id ?? "",
  });

  const leaveRoom = useMutation(api.rooms.leaveRoom);
  const updateRoomStatus = useMutation(api.rooms.updateRoomStatus);

  // Skip queries if room is deleted or clientRoomId is missing
  const room = useQuery(
    api.rooms.getRoom,
     !clientRoomId ? "skip" : { roomId: clientRoomId }
  );
  localStorage.setItem("currentQuestionIndex", "0");
  localStorage.setItem("wrongAnswers", "0");
  localStorage.setItem("correctAnswer", "0");
  const participants = useQuery(
    api.rooms.getParticipantsInRoom,
     !clientRoomId ? "skip" : { roomId: clientRoomId }
  );

  // Set the room ID from the URL parameters
  useEffect(() => {
    if (typeof roomId === "string") {
      setClientRoomId(roomId);
    }
  }, [roomId]);

  // Redirect users based on room status and their role
  useEffect(() => {
    if (room && room.status === "in-progress") {
      if (userDetails?.role === "teacher") {
        router.push(`/app/leaderBoard/${clientRoomId}`);
      } else if (userDetails?.role === "student") {
        router.push(`/app/quiz/${clientRoomId}`);
      }
    }
  }, [room, userDetails, clientRoomId, router]);

  // Redirect to the disabled room page if the room is deleted
  useEffect(() => {
    if (room && room.status === "closed") {
      router.push("/app/disabledroom");
    }
  }, [room, router]);

  // Handle user leaving the room
  const handleLeaveRoom = async () => {
    if (clientRoomId) {
      await leaveRoom({ roomId: clientRoomId });
      router.push("/app"); // Redirect students to the home page
    }
  };

  // Handle teacher closing the room
  const handleCloseRoom = async () => {
    if (clientRoomId) {
      await updateRoomStatus({ roomId: clientRoomId, status: "closed" });
      router.push("/app/disabledroom"); 
      await deleteRoom({ roomId: clientRoomId }); 
      setClientRoomId(null); 
    }
  };

  // Update room status to "in-progress"
  const handleUpdateRoomStatus = async () => {
    if (clientRoomId && room?.participants && room.participants.length >0) {  //later on change this to 3 maybe after demo
      await updateRoomStatus({ roomId: clientRoomId, status: "in-progress" });
    }
    if(!room?.participants|| room?.participants && room?.participants?.length == 0 ){
      alert("Minimum 3 participants required to start the quiz.");
    }
  };

  // Copy room ID to clipboard
  const copyRoomId = () => {
    if (clientRoomId) {
      navigator.clipboard.writeText(clientRoomId);
    }
  };

  // Calculate spaces left only if room exists
  let spacesLeft = 0;
  if (room && room.settings) {
    spacesLeft = (room.settings.maxParticipants ?? 0) - (room.participants?.length ?? 0);
  }

  return (
    <>

      <div className="min-h-screen bg-black text-white relative">
      {/* Header */}
      <header className="p-4 border-b border-green-800 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Waiting Room</h1>
      <div className="flex items-center space-x-4">
        <RoomInfo />
        <RoomSettingsForm roomID={String(clientRoomId)} />
        {userDetails?.role === 'student' && (
          <button
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg text-sm font-medium"
            onClick={handleLeaveRoom}
            title="Leave Room"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {userDetails?.role === 'teacher' && (
          <button
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg text-sm font-medium"
            onClick={handleCloseRoom}
            title="Close Room"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>

      {/* Main Content */}
      <main className="p-4 space-y-6">
        {/* Room Sharing Section */}
        <div className="bg-green-600 hover:bg-[#45a049] transition-colors cursor-pointer border-0 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 text-white mb-2">
          <Share2 className="w-4 h-4" />
          <span className="text-sm">Share Room with Friends</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white rounded px-3 py-1.5 flex-1 font-mono text-xs text-black overflow-hidden">
          {clientRoomId}
          </div>
          <button onClick={copyRoomId} className="p-1.5 bg-white rounded-lg" title="Copy Room ID">
          <Copy className="w-4 h-4 text-black" />
          </button>
        </div>
        </div>

        {/* Quiz Info */}
        <div className="bg-green-600 hover:bg-[#45a049] transition-colors cursor-pointer border-0 rounded-lg p-4 space-y-3">
        <div>
          <h2 className="text-xl font-semibold text-white">{room?.quiz?.description}</h2>
          <p className="text-sm text-gray-200">Hosted by {room?.hostedBy}</p>
        </div>
        {room?.quiz?.description && <p className="text-sm text-gray-200">{room.quiz.description}</p>}
        
        {/* Participants Count */}
        <div className="bg-[#2E7D32] rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-white">
            <Users className="w-4 h-4" />
            <span className="text-sm">{room?.participants?.length ?? 0} participants</span>
          </div>
          <span className="text-xs text-gray-200">{spacesLeft} spaces left</span>
          </div>
          <div className="w-full bg-black rounded-full h-1.5">
          <div
            className="bg-green-400 h-1.5 rounded-full transition-all duration-500"
            style={{
            width: `${(room?.participants?.length ?? 0) / (room?.settings?.maxParticipants ?? 1) * 100}%`,
            }}
          />
          </div>
        </div>
        </div>

        {/* Participants List */}
        <div>
        <h2 className="text-lg font-semibold text-green-400 mb-3">Participants</h2>
        <div className="space-y-2">
          {participants?.map((participant, index) => (
          <div key={index} className="bg-[#1A1A1A] rounded-lg p-3 flex items-center gap-3">
            <div className="relative">
            <Image
              src={participant.imageUrl || "/placeholder.svg"}
              alt=""
              width={40}
              height={40}
              className="rounded-full object-cover border border-green-400/20"
            />
            <div
              className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-black ${
              participant.status === "ready" ? "bg-green-400" : "bg-gray-400"
              }`}
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

        <p className="text-gray-500 text-sm text-center">Waiting for more..</p>
        {userDetails?.role === "teacher" && (
        <button className="bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg w-full text-sm font-medium" onClick={handleUpdateRoomStatus}>
          Start Quiz
        </button>
        )}
      </main>
      </div>
    </>
  );
}