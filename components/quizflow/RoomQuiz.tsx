"use client"

import { useState, useEffect } from "react"
import QuestionDisplay from "./QuestionDisplay"
import Timer from "./Timer"
import QuizComplete from "./QuizComplete"
import ExplanationDisplay from "./ExplanationDisplay"
import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import { useParams, useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import ParticipantOptions  from "../Room Components/ParticipantOptions"

interface Question {
  points?: number;
  timeLimit?: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export default function RoomQuiz() {

    const params = useParams()
    const router = useRouter()
    const roomId = params.roomId 
    const quizQuestion = useQuery(api.rooms.getQuizQuetsions, { roomId: String(roomId) ?? "" })
    const currentRoom= useQuery(api.rooms.getRoom, { roomId: String(roomId) ?? "" })
    console.log(quizQuestion)
  
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(localStorage.getItem("currentQuestionIndex") ? Number(localStorage.getItem("currentQuestionIndex")) : 0)
  const [isLoading, setIsLoading] = useState(true)
  const [quizComplete, setQuizComplete] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState(0)
  const [timeTaken, setTimeTaken] = useState<number[]>([])
  const [stopTimer, setStopTimer] = useState(false)
  const updateParticipants = useMutation(api.rooms.updateParticipant)

  useEffect(() => {
    if (quizQuestion) {
      setQuestions(quizQuestion)
      setIsLoading(false)
      setCorrectAnswers(localStorage.getItem("correctAnswers") ? Number(localStorage.getItem("correctAnswers")) : 0)
      setWrongAnswers(localStorage.getItem("wrongAnswers") ? Number(localStorage.getItem("wrongAnswers")) : 0)
    }
  }, [quizQuestion,router])

  useEffect(() => {
    if (currentRoom?.status === "completed") {
      setQuizComplete(true)
    }
  }, [currentRoom])
  const handleSubmit = () => {
    if (selectedAnswer) {
      if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
        setCorrectAnswers((prev) => prev + (questions[currentQuestionIndex].points ?? 0))
        localStorage.setItem("correctAnswers", String(correctAnswers + (questions[currentQuestionIndex].points ?? 0)))
        setStopTimer(true)
      } else {
        setWrongAnswers((prev) => prev + 1)
        localStorage.setItem("wrongAnswers", String(wrongAnswers + 1))
        setStopTimer(true)
      }
      setShowExplanation(true)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      if (currentQuestionIndex + 1 < questions.length) {
        localStorage.setItem("currentQuestionIndex", String(currentQuestionIndex + 2));
      }
      setSelectedAnswer(null)
      setShowExplanation(false)
      setTimerKey((prevKey) => prevKey + 1)
      setStopTimer(false)
    } else {
      setQuizComplete(true)
    }
  }

    const handleTimer = (elapsedTime:number) => {
      setShowExplanation(true)
      setTimeTaken((prev) => [...prev, elapsedTime])
      console.log(timeTaken)
      setStopTimer(true)
    }
  
if(timeTaken.length>0)
{
  updateParticipants({roomId: String(roomId), timeTaken: timeTaken, status: "playing",score: correctAnswers})
}
  if (!quizQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500" />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500" />
      </div>
    )
  }

  if (quizComplete) {
    return (
      <QuizComplete roomId={String(roomId)} correctAnswers={correctAnswers} wrongAnswers={wrongAnswers} totalQuestions={questions.length} />
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
    {/* Top section: Participant options on the left; Timer and Question Number on the right */}
    <div className="flex items-center justify-between mb-4">
      <ParticipantOptions />
      <div className="flex w-full items-center gap-4 justify-between">
      <p className=" flex-start text-2xl font-bold text-white">
          {currentQuestionIndex + 1}/{questions.length}
        </p>
        <Timer
          key={timerKey}
          duration={questions[currentQuestionIndex].timeLimit ?? 50}
          onTimerEnd={handleTimer}
          stop={stopTimer}
        />
       
      </div>
    </div>
  
    {/* Main Content: Question or Explanation */}
    {!showExplanation ? (
      <QuestionDisplay
        question={questions[currentQuestionIndex]}
        selectedAnswer={selectedAnswer}
        setSelectedAnswer={setSelectedAnswer}
        onSubmit={handleSubmit}
      />
    ) : (
      <ExplanationDisplay
        explanation={questions[currentQuestionIndex].explanation}
        correctAnswer={questions[currentQuestionIndex].correctAnswer}
        selectedAnswer={selectedAnswer}
        onNext={handleNext}
      />
    )}
  
    {/* Score Display */}
    <div className="mt-4 text-center space-x-4">
      <span className="text-green-500">Correct: {correctAnswers}</span>
      <span className="text-red-500">Wrong: {wrongAnswers}</span>
    </div>
  </div>
  
  
  )
}

// very clenly, add toast notification for complete quziz by host
//  add a dailog box to show a live leader board popup to participants
//  handle leaving teh room gracefully