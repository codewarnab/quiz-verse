import React, { useState } from 'react';
import { Clock, BookOpen, BarChart2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import RoomSettingsForm from './RoomSettingsForm';
interface QuizData {
    title: string;
    description: string;
    difficulty: string;
    timeLimit: number;
    instructions: string;
    numberOfQuestions: number;
    questions: {
        question: string;
        options: string[];
        correctAnswer: string;
        explanation: string;
    }[];
}
interface FileArray {
 url: string;
 extension:string;
 fileName:string;
 size:number;
 mimeType:string;
}
interface QuizPreviewProps {
    quiz: QuizData;
    filesArray: FileArray[]
}

const MobileQuizPreview: React.FC<QuizPreviewProps> = ({ quiz, filesArray }) => {
    const [showInstructions, setShowInstructions] = useState(false);
    const [showSample, setShowSample] = useState(false);
    const { roomId } = useParams();
    const updateQuizInfoInRoom = useMutation(api.rooms.updateQuizInfoInRoom);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [settings, setSettings] = useState({
        maxParticipants: 0,
        randomizeQuestions: false,
        waitForAllAnswers: false
    });

    const handleOpenModal = () => {
        setIsModalOpen(true);
      };

      const handleCloseModal = () => {
        setIsModalOpen(false);
      };

    const handleSubmitSettings = (settings: {
        maxParticipants?: number;
        randomizeQuestions?: boolean;
        waitForAllAnswers?: boolean;
      }) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            ...settings,
            maxParticipants: settings.maxParticipants ?? prevSettings.maxParticipants,
            randomizeQuestions: settings.randomizeQuestions ?? prevSettings.randomizeQuestions,
            waitForAllAnswers: settings.waitForAllAnswers ?? prevSettings.waitForAllAnswers
        }));
        console.log('Settings submitted:', settings);
    };

    const handleStartingQuiz = async () => {
        // TODO: handle eror, show a toast before redirection to waiting page
        // TODO: IMPROVE THE UI, checkOut synctoconvex
        console.log("Starting Quiz");
        const newRoomId = await updateQuizInfoInRoom({
            roomId: String(roomId),
            givenfiles: filesArray,
            status: "waiting",
            quiz: {
                title: quiz.title,
                description: quiz.description,
                numberOfQuestions: quiz.numberOfQuestions,
                questions: quiz.questions.map(({ correctAnswer, explanation, ...rest }) => ({
                    ...rest,
                    correctAnswer,
                    explanation
                }))
            },
            settings: {
                maxParticipants: Number(settings.maxParticipants),
                randomizeQuestions: settings.randomizeQuestions || false,
                waitForAllAnswers: settings.waitForAllAnswers || false
            }
        });
        console.log(newRoomId);
    }

    const handleStartQuizClick = () => {
        if (
            settings.maxParticipants === 0 &&
            !settings.randomizeQuestions &&
            !settings.waitForAllAnswers
        ) {
            handleOpenModal();
        } else {
            handleStartingQuiz();
        }
    };
    return (
        <div className=''>
        <Card className="w-full max-w-md mx-auto bg-zinc-900 text-white">
            <CardContent className="p-4 space-y-4">
                {/* Header */}
                <div>
                    <h1 className="text-xl font-bold">{quiz.title}</h1>
                    <p className="text-sm text-gray-400 mt-1">{quiz.description}</p>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-zinc-800 p-3 rounded-lg flex flex-col items-center">
                        <Clock className="w-5 h-5 mb-1 text-blue-400" />
                        <span className="text-sm text-gray-300">{quiz.timeLimit / 60}min</span>
                    </div>
                    <div className="bg-zinc-800 p-3 rounded-lg flex flex-col items-center">
                        <BookOpen className="w-5 h-5 mb-1 text-green-400" />
                        <span className="text-sm text-gray-300">{quiz.numberOfQuestions}Q</span>
                    </div>
                    <div className="bg-zinc-800 p-3 rounded-lg flex flex-col items-center">
                        <BarChart2 className="w-5 h-5 mb-1 text-yellow-400" />
                        <span className="text-sm text-gray-300">{quiz.difficulty}</span>
                    </div>
                </div>

                {/* Category */}
                <div className="bg-zinc-800 px-3 py-2 rounded-lg">
                    <span className="text-sm text-gray-400">Category: </span>
                    {/* <span className="text-sm text-gray-200">{quiz.category}</span> */}
                </div>

                {/* Collapsible Instructions */}
                <div className="bg-zinc-800 rounded-lg overflow-hidden">
                    <button
                        onClick={() => setShowInstructions(!showInstructions)}
                        className="w-full px-3 py-2 flex justify-between items-center"
                    >
                        <span className="text-sm font-medium">Instructions</span>
                        {showInstructions ?
                            <ChevronUp className="w-4 h-4 text-gray-400" /> :
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        }
                    </button>
                    {showInstructions && (
                        <div className="px-3 pb-3">
                            <p className="text-sm text-gray-400">{quiz.instructions}</p>
                        </div>
                    )}
                </div>

                {/* Collapsible Sample Question */}
                <div className="bg-zinc-800 rounded-lg overflow-hidden">
                    <button
                        onClick={() => setShowSample(!showSample)}
                        className="w-full px-3 py-2 flex justify-between items-center"
                    >
                        <span className="text-sm font-medium">Sample Question</span>
                        {showSample ?
                            <ChevronUp className="w-4 h-4 text-gray-400" /> :
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        }
                    </button>
                    {showSample && (
                        <div className="px-3 pb-3">
                            <p className="text-sm text-gray-300 mb-2">{quiz.questions[0].question}</p>
                            <ul className="text-sm text-gray-400 space-y-1">
                                {quiz.questions[0].options.map((option, idx) => (
                                    <li key={idx} className="pl-4">• {option}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Start Button */}
                <Button className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white" onClick={handleStartQuizClick}>
                    Start Quiz
                </Button>
                <RoomSettingsForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitSettings}
      />
            </CardContent>
        </Card>
        </div>
    );
};

export default MobileQuizPreview;

// start quiz, 
{/*
1. mutate teh schema of the room   ---> 

givenfiles: v.optional(v.array(v.object({
      url: v.string(),
      size: v.number(),
      fileName: v.string(),
      extension: v.string(),
    }))),   ---->  
    
    quiz: v.object({
          title: v.string(),
          description: v.optional(v.string()),
          numberOfQuestions: v.number(),
          questions: v.array(
            v.object({
              question: v.string(),
              options: v.array(v.string()),
              correctAnswer: v.string(),
              explanation: v.string(),
              points: v.optional(v.number()),
              timeLimit: v.optional(v.number()),
            })
          ),
        }),

ROOM SCHEMA READY , NOW GO LIVE (WAITING AREA--->)
2. In the wiating area, dispaly the quiz preview, blah blah...
*/}

// STATUS : IN_PROGRESS