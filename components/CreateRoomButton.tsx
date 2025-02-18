'use client';
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
export default function CreateRoomButton() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const createRoom = useMutation(api.rooms.createRoom);
  const router = useRouter();
  const handleCreateRoom = async () => {
    const newRoomId = await createRoom();
    setRoomId(newRoomId);
    router.push(`/app/upload-content/${newRoomId}`);
  };

  return (
    <div className="p-6 bg-[#0F1F18] rounded-lg text-white text-center">
    {!roomId && 
      <button 
        onClick={handleCreateRoom}
        className="px-6 py-3 bg-green-500 text-white rounded-lg text-lg font-semibold hover:bg-green-600 transition"
      >
        Create Room
      </button>
    }
  </div>
  );
}

// <p>
//           Room created! Room ID: {roomId}
//         </p>
//         <Link href={`/app/waiting/${roomId}`}>
//           <p className="px-4 py-2 bg-blue-500 text-white rounded-md">
//             Go to Waiting Room
//           </p>
//         </Link>
//         </>