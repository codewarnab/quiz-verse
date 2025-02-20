import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BarChart2, LogOut, Menu } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import LeaderBoard from '../quizflow/LeaderBoard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ParticipantOptions() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const updateParticipants = useMutation(api.rooms.updateParticipant);

  const handleSeeLeaderboard = () => {
    setShowLeaderboard(true);
    console.log("See leaderboard clicked");
  };

  const handleQuit = () => {
    updateParticipants({ roomId: roomId, status: "left" });
    router.push(`/app/leaderBoard/${roomId}`);
    console.log("Quit clicked");
  };

  return (
    <div className="absolute top-4 right-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Menu className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-2">
          <div className="grid gap-2">
            <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-start gap-2" onClick={handleSeeLeaderboard}>
                  <BarChart2 className="w-4 h-4" />
                  Leaderboard
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Leaderboard</DialogTitle>
                </DialogHeader>
                <LeaderBoard roomId={roomId} />
              </DialogContent>
            </Dialog>
            <Button variant="destructive" className="w-full flex items-center justify-start gap-2 text-white border-red-500" onClick={handleQuit}>
              <LogOut className="w-4 h-4" />
              Quit
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}