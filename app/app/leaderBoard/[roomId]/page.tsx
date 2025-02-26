"use client"
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Share2 } from 'lucide-react';
import LeaderBoard from '@/components/quizflow/LeaderBoard';

const LeaderBoardPage = () => {
  const { roomId } = useParams();
  const updateRoomStatus = useMutation(api.rooms.updateRoomStatus);
  const deleteRoom = useMutation(api.rooms.deleteRoom);
  const [roomDeleted, setRoomDeleted] = useState(false);

  const room = !roomDeleted? useQuery(api.rooms.getRoom, { roomId: String(roomId) }): null;
  const router = useRouter();

  const handleShareClick = () => {
    const shareUrl = `${window.location.origin}/app/leaderBoard/${roomId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  useEffect(() => {
    if (room && room.status === 'closed') {
      router.push('/app/disabledroom');
      deleteRoom({ roomId: String(roomId) })
        .then(() => {
          console.log('Room successfully deleted.');
        })
        .catch((error) => {
          console.error('Failed to delete room:', error);
        });
    }
  }, [room, router, roomId, deleteRoom]);

  const handleEndQuiz = async () => {
    try {
      await updateRoomStatus({ roomId: String(roomId), status: 'completed' });
      console.log('Room status updated to completed.');
    } catch (error) {
      console.error('Failed to update room status:', error);
    }
  };

  const handleExit = async () => {
    try {
      await updateRoomStatus({ roomId: String(roomId), status: 'closed' });
      setRoomDeleted(true);
      console.log('Room status updated to closed.');
      router.push('/app/disabledroom');
    } catch (error) {
      console.error('Failed to update room status:', error);
    }
  };

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

      <LeaderBoard roomId={String(roomId)} />

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
        <Button variant="outline" onClick={handleEndQuiz}>
          End Quiz
        </Button>
        <Button variant="outline" onClick={handleExit}>
          Exit
        </Button>
      </div>
    </div>
  );
};

export default LeaderBoardPage;