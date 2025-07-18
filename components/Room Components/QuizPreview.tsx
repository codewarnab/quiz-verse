import React, { useState } from 'react';
import { Clock, BookOpen, BarChart2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface QuizData {
    title: string;
    description: string;
    difficulty: string;
    timeLimit: number;
    instructions: string;
    numberOfQuestions: number;
    category?: string;
    questions: {
        question: string;
        options: string[];
        correctAnswer: string;
        explanation: string;
    }[];
}

interface FileArray {
    url: string;
    extension?: string;
    fileName?: string;
    size?: number;
    mimeType?: string;
}

interface QuizPreviewProps {
    quiz: QuizData;
    filesArray: FileArray[];
}

const QuizPreview: React.FC<QuizPreviewProps> = ({ quiz, filesArray }) => {
    const router = useRouter();
    const [showInstructions, setShowInstructions] = useState(false);
    const [showSample, setShowSample] = useState(false);
    const { roomId } = useParams();
    const updateQuizInfoInRoom = useMutation(api.rooms.updateQuizInfoInRoom);

    const handleStartingQuiz = async () => {
        try {
            console.log("Starting Quiz", String(roomId));
            const newRoomId = await updateQuizInfoInRoom({
                roomId: String(roomId),
                givenfiles: filesArray.length > 0 && filesArray[0].extension && filesArray[0].size && filesArray[0].fileName && filesArray[0].mimeType ? [{
                    url: filesArray[0].url,
                    size: filesArray[0].size,
                    fileName: filesArray[0].fileName,
                    extension: filesArray[0].extension,
                    mimeType: filesArray[0].mimeType,
                }] : [{
                    url: "",
                    size: 0,
                    fileName: "",
                    extension: "",
                    mimeType: "",
                }],
                givenUrl: [filesArray[0].url],
                status: "waiting",
                quiz: {
                    title: quiz.title,
                    description: quiz.description,
                    numberOfQuestions: quiz.numberOfQuestions,
                    questions: quiz.questions.map((question) => ({
                        question: question.question,
                        options: question.options,
                        correctAnswer: question.correctAnswer,
                        explanation: question.explanation,
                        points: 1,
                        timeLimit: quiz.timeLimit
                    }))
                },
                settings: {
                    maxParticipants: 20,
                    randomizeQuestions: false,
                    waitForAllAnswers: false
                }
            });
            
            console.log("New Room ID:", newRoomId);
            if (!newRoomId) {
                console.error("Failed to start quiz, no room ID returned");
                return;
            }
            
            if (newRoomId === roomId) {
                console.log("Redirecting to waiting room");
                router.push(`/app/waiting/${roomId}`);
            } else {
                console.error("Failed to start quiz, room ID mismatch");
            }
        } catch (error) {
            console.error("Error starting quiz:", error);
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
                        <span className="text-sm text-gray-400">Category: {quiz.category ?? ""}</span>
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
                    <Button className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white" onClick={handleStartingQuiz}>
                        Start Quiz
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default QuizPreview;