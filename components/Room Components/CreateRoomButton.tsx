'use client';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export default function CreateRoomButton() {
  const createRoom = useMutation(api.rooms.createRoom);
  const router = useRouter();

  const handleCreateRoom = async () => {
    const newRoomId = await createRoom();
    router.push(`/app/upload-content/${newRoomId}`);
  };

  return (
    <div className=" rounded-lg text-white text-center">
        <button 
          onClick={handleCreateRoom}
          className="px-6 py-3 bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-lg text-lg font-semibold transition"
        >
          Create Room
        </button>
    </div>
  );
}