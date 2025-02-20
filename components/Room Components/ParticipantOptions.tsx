import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BarChart2, LogOut, Menu } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ParticipantOptions() {
  const router = useRouter();
  const params= useParams()
  const roomId = params.roomId as string;

  const updateParticipants = useMutation(api.rooms.updateParticipant)
  const handleSeeLeaderboard = () => {
    // Add your logic here
    console.log("See leaderboard clicked");
  };

  const handleQuit = () => {
    updateParticipants({roomId: roomId, status: "left"})
    router.push(`/app/leaderBoard/${roomId}`)
    console.log("Quit clicked");
  };

  return (
    <div className="absolute top-4 right-4">
      <Popover >
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Menu className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit p-2">
          <div className="grid gap-2">
            <Button variant="outline" className="w-full flex items-center justify-start gap-2" onClick={handleSeeLeaderboard}>
              <BarChart2 className="w-4 h-4" />
              Leaderboard
            </Button>
            <Button variant="destructive" className="w-full flex items-center justify-start gap-2 text-red-500 border-red-500" onClick={handleQuit}>
              <LogOut className="w-4 h-4" />
              Quit
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}