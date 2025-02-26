'use client';
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export default function CreateRoomButton() {
  const [isLoading, setIsLoading] = useState(false);
  const createRoom = useMutation(api.rooms.createRoom);
  const router = useRouter();

  const handleCreateRoom = async () => {
    setIsLoading(true);
    const newRoomId = await createRoom();
    router.push(`/app/upload-content/${newRoomId}`);
  };

  return (
    <div className="p-6 rounded-lg text-white text-center">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500" />
        </div>
      ) : (
        <button 
          onClick={handleCreateRoom}
          className="px-6 py-3 bg-green-700 text-white rounded-lg text-lg font-semibold hover:bg-green-600 transition"
        >
          Create Room
        </button>
      )}
    </div>
  );
}