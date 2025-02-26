import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useMutation } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { Settings } from "lucide-react";

interface RoomSettingsFormProps {
  roomID: string;
}

const RoomSettingsForm: React.FC<RoomSettingsFormProps> = ({ roomID }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState<number | undefined>(undefined);
  const [randomizeQuestions, setRandomizeQuestions] = useState<boolean | undefined>(undefined);
  const [waitForAllAnswers, setWaitForAllAnswers] = useState<boolean | undefined>(undefined);

  const updateQuizInfoInRoom = useMutation(api.rooms.updateQuizInfoInRoom);

  const updateRoomConfig = async () => {
    try {
      updateQuizInfoInRoom({
        roomId: roomID,
        settings: {
          maxParticipants: maxParticipants || 20,
          randomizeQuestions: randomizeQuestions || false,
          waitForAllAnswers: waitForAllAnswers || false
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRoomConfig();
    setIsOpen(false);
  };

  return (
    <>
      <div className="">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button >
              <Settings className="w-6 h-6 " />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 p-0">
            <div className="p-6">
              <DialogTitle className="text-lg font-medium text-white mb-4">
                Room Settings
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-300 mb-6">
                Configure the room settings below.
              </DialogDescription>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    id="maxParticipants"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-800 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="randomizeQuestions"
                    checked={randomizeQuestions}
                    onChange={(e) => setRandomizeQuestions(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-600 bg-zinc-800 text-green-500 focus:ring-offset-zinc-900 focus:ring-green-500"
                  />
                  <label htmlFor="randomizeQuestions" className="text-sm font-medium text-gray-300 cursor-pointer">
                    Randomize Questions
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="waitForAllAnswers"
                    checked={waitForAllAnswers}
                    onChange={(e) => setWaitForAllAnswers(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-600 bg-zinc-800 text-green-500 focus:ring-offset-zinc-900 focus:ring-green-500"
                  />
                  <label htmlFor="waitForAllAnswers" className="text-sm font-medium text-gray-300 cursor-pointer">
                    Wait for All Answers
                  </label>
                </div>

                <Button type="submit" className="w-full bg-green-500 text-white hover:bg-green-600 mt-6">
                  Update
                </Button>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default RoomSettingsForm;