'use client';

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { quizData } from "./SampleQuiz"

export default function CreateRoomButton() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const createRoom = useMutation(api.rooms.createRoom);

  const handleCreateRoom = async () => {
    const newRoomId = await createRoom({
      name: "Quiz Room Name",
      quiz: {
        ...quizData,
        questions: quizData.questions.map(({ correctAnswer, points = 0, timeLimit = 60, ...rest }) => ({
          ...rest,
          correctAnswer,
          points,
          timeLimit
        }))
      }, // Use SampleQuiz as the quiz argument
      settings: {
        maxParticipants: 10,
        randomizeQuestions: false,
        waitForAllAnswers: true
      }
    });
    setRoomId(newRoomId);
  };

  return (
    <div>
      {roomId ? (
        <>
        <p>
          Room created! Room ID: {roomId}
        </p>
        <Link href={`/app/waiting/${roomId}`}>
          <p className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Go to Waiting Room
          </p>
        </Link>
        </>
      ) : (
        <button 
          onClick={handleCreateRoom}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Create Room
        </button>
      )}

    </div>
  );
}