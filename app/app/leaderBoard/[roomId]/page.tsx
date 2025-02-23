"use client";
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from '@/components/ui/card';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LeaderBoard from '@/components/quizflow/LeaderBoard';

const LeaderBoardPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const roomId = params?.roomId as string;
  const [loading, setLoading] = useState(false);
  const [roomDeleted, setRoomDeleted] = useState(false);

  const updateRoomStatus = useMutation(api.rooms.updateRoomStatus);
  const deleteRoom = useMutation(api.rooms.deleteRoom);
  const room = useQuery(api.rooms.getRoom, roomDeleted || !roomId ? "skip" : { roomId: roomId });

  const handleShareClick = () => {
    const shareUrl = `${window.location.origin}/app/leaderBoard/${roomId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  useEffect(() => {
    if (room && room.status === "closed") {
      setRoomDeleted(true); // Mark room as deleted
      router.push("/app/disabledroom");
    }
  }, [room, router]);

  const handleEndQuiz = async () => {
    try {
      // TODO: SHOW A TOAST TO ALL USER THAT QUIZ ENDED
      await updateRoomStatus({ roomId, status: "completed" });
    } catch (error) {
      console.error("Failed to update room status:", error);
    }
  };

  const handleExit = async () => {
    if (!confirm("Are you sure you want to exit?")) return;
    if (!roomDeleted) {
      if (room?.participants && room.participants.every(participant => participant.status === "finished")) {
        try {
          setLoading(true); // Start loading animation
          await updateRoomStatus({ roomId, status: "closed" });
          await deleteRoom({ roomId });
          setRoomDeleted(true); // Mark room as deleted
          router.push("/app/disabledroom");
        } catch (error) {
          console.error("Failed to delete room:", error);
          alert("Room not found. Please try again.");
          setLoading(false); // Stop loading animation on error
        }
      } else {
        alert("All participants must have finished the quiz before you can exit.");
      }
    }
  };

  useEffect(() => {
    if (roomDeleted) {
      router.push("/app/disabledroom");
    }
  }, [roomDeleted, router]);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="mb-8 p-6 bg-zinc-950 border-zinc-800 border-[0.1px] rounded-lg shadow-lg">
        <h2 className="text-4xl font-extrabold text-green-500 mb-4">
          Leaderboard Champions
        </h2>
        <p className="text-lg text-gray-400 mb-2">
          Discover the top performers and celebrate their outstanding achievements!
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500" />
        </div>
      ) : (
        <>
          {!roomDeleted && <LeaderBoard roomId={roomId} />}

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

          <div className="flex justify-evenly mt-4">
            <button
              onClick={handleEndQuiz}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold shadow-lg"
            >
              End Quiz
            </button>
            <button
              onClick={handleExit}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold shadow-lg"
            >
              Exit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LeaderBoardPage;