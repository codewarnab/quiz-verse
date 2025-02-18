import React, { useState } from 'react';
import { Clock, BookOpen, BarChart2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface QuizData {
    title: string;
    description: string;
    category: string;
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

interface QuizPreviewProps {
    quiz: QuizData;
}

const MobileQuizPreview: React.FC<QuizPreviewProps> = ({ quiz }) => {
    const [showInstructions, setShowInstructions] = useState(false);
    const [showSample, setShowSample] = useState(false);

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
                    <span className="text-sm text-gray-200">{quiz.category}</span>
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
                <Button className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white">
                    Start Quiz
                </Button>
            </CardContent>
        </Card>
        </div>
    );
};

export default MobileQuizPreview;