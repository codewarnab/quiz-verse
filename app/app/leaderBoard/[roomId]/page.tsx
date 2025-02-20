"use client";
import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from "next/navigation";
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LeaderBoardPage = () => {
  const { roomId } = useParams();
  const participants = useQuery(api.rooms.getTopParticipants, { roomId: String(roomId) });
  const updateRoomStatus = useMutation(api.rooms.updateRoomStatus);

  const handleShareClick = () => {
    const shareUrl = `${window.location.origin}/app/leaderBoard/${roomId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  const handleEndQuiz = () => {
    updateRoomStatus({ roomId: String(roomId), status: "completed" });
  }

  const remainingParticipants= participants?.filter((participant) => participant.status === "playing").length;

  const finishedParticipants = participants?.filter((participant) => participant.status === "finished").length;

  const leftParticipants = participants?.filter((participant) => participant.status === "left").length;

  if((leftParticipants?? 0)+ (finishedParticipants?? 0)== participants?.length){ {
    handleEndQuiz();
  }
  }
  return (
    <div className="min-h-screen bg-black text-white p-4">
    <div className="mb-4">
  <h2 className="text-3xl font-bold text-green-400 mt-3">Leaderboard Champions</h2>
  <p className="text-sm text-gray-300">
    Discover the top performers and celebrate their outstanding achievements!
  </p>
</div>

      <div>
        <AnimatePresence>
          {participants?.map((participant) => (
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

      <div className="mt-4">
  <Card className="w-full max-w-md mx-auto bg-zinc-900 text-white">
    <CardContent className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Share Your Achievement</h3>
        <Button variant="outline" onClick={handleShareClick}>
          <Share2 className="w-5 h-5 mr-2" />
          Copy Link
        </Button>
      </div>
      <p className="text-sm text-gray-400">
        Celebrate your success by sharing your leaderboard achievement with friends. Copy the link below and let others see your impressive ranking!
      </p>
    </CardContent>
  </Card>
</div>


<div className="flex justify-center mt-4">
  <button
    onClick={handleEndQuiz}
    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold shadow-lg"
  >
    Conclude Quiz Session
  </button>
</div>

    </div>
  );
};
export default LeaderBoardPage;
