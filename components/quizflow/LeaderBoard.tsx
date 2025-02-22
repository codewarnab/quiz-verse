"use client";
import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface LeaderBoardProps {
  roomId: string;
}

const LeaderBoard: React.FC<LeaderBoardProps> = ({ roomId }) => {
  const participants = useQuery(api.rooms.getTopParticipants, { roomId: String(roomId) });

  if (!participants) return <div>Loading...</div>;

  return (
    <div>
      <AnimatePresence>
        {participants.map((participant) => (
          <motion.div
            key={participant.userId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: 0,
            }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ 
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 1
            }}
            layout
            className="bg-[#1A1A1A] rounded-lg p-3 flex items-center gap-3 mb-2"
          >
            <div className="relative">
              <Image
                src={participant.imageUrl || "/placeholder.svg"}
                alt={participant.name || "Participant"}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover border border-green-400/20"
              />
              <div
                className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border border-black ${
                  participant.status === "playing" ? "bg-yellow-500" : 
                  participant.status === "left" ? "bg-red-400" : 
                  participant.status === "finished" ? "bg-gray-500" : "bg-gray-400"
                }`}
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-green-50">{participant.name}</h3>
              <p className="text-xs text-gray-400 capitalize">Status: {participant.status}</p>
              <motion.p 
                className="text-xs text-gray-400"
                initial={{ scale: 1 }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  color: ['#9CA3AF', '#22C55E', '#9CA3AF']
                }}
                transition={{ duration: 0.5 }}
                key={participant.score}
              >
                Score: {participant.score}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default LeaderBoard;