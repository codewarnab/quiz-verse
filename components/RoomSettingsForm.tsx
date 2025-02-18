import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface RoomSettingsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (settings: {
    maxParticipants?: number;
    randomizeQuestions?: boolean;
    waitForAllAnswers?: boolean;
  }) => void;
}

const RoomSettingsForm: React.FC<RoomSettingsFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [maxParticipants, setMaxParticipants] = useState<number | undefined>(undefined);
  const [randomizeQuestions, setRandomizeQuestions] = useState<boolean | undefined>(undefined);
  const [waitForAllAnswers, setWaitForAllAnswers] = useState<boolean | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ maxParticipants, randomizeQuestions, waitForAllAnswers });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 p-0">
        <div className="p-6">
          <DialogTitle className="text-lg font-medium text-white">
            Room Settings
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-300 mt-1.5">
            Configure the room settings below.
          </DialogDescription>
          
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
            
            <label className="flex items-center gap-x-2 cursor-pointer">
              <input
                type="checkbox"
                id="randomizeQuestions"
                checked={randomizeQuestions}
                onChange={(e) => setRandomizeQuestions(e.target.checked)}
                className="h-4 w-4 rounded border-gray-600 bg-zinc-800 text-green-500 focus:ring-offset-zinc-900 focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-300">
                Randomize Questions
              </span>
            </label>
            
            <label className="flex items-center gap-x-2 cursor-pointer">
              <input
                type="checkbox"
                id="waitForAllAnswers"
                checked={waitForAllAnswers}
                onChange={(e) => setWaitForAllAnswers(e.target.checked)}
                className="h-4 w-4 rounded border-gray-600 bg-zinc-800 text-green-500 focus:ring-offset-zinc-900 focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-300">
                Wait for All Answers
              </span>
            </label>
            
            <Button type="submit" className="w-full bg-green-500 text-white hover:bg-green-600 mt-6">
              Start Quiz
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomSettingsForm;