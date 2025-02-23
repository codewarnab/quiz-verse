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
import {ChevronDown} from "lucide-react"

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
  const [showExplanationButton, setShowExplanationButton] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState(0)
  const [timeTaken, setTimeTaken] = useState<number[]>([])
  const [stopTimer, setStopTimer] = useState(false)
  const [answerSubmitted, setAnswerSubmitted] = useState(false) // New state variable
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
    if (selectedAnswer && !answerSubmitted) { // Ensure answerSubmitted is false
      if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
        setCorrectAnswers((prev) => prev + (questions[currentQuestionIndex].points ?? 0))
        localStorage.setItem("correctAnswers", String(correctAnswers + (questions[currentQuestionIndex].points ?? 0)))
        localStorage.setItem("currentQuestionIndex", String(currentQuestionIndex + 1));
        setStopTimer(true)
      } else {
        setWrongAnswers((prev) => prev + 1)
        localStorage.setItem("wrongAnswers", String(wrongAnswers + 1))
        setStopTimer(true)
      }
      setShowExplanationButton(true)
      setAnswerSubmitted(true) // Set answerSubmitted to true
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      if (currentQuestionIndex + 1 < questions.length) {
        localStorage.setItem("currentQuestionIndex", String(currentQuestionIndex + 1));
      }
      setSelectedAnswer(null)
      setAnswerSubmitted(false) // Reset answerSubmitted to false
      setTimerKey((prevKey) => prevKey + 1)
      setStopTimer(false)
    } else {
      setQuizComplete(true)
    }
  }

    const handleTimer = (elapsedTime:number) => {
      // setShowExplanation(true)
      setTimeTaken((prev) => [...prev, elapsedTime])
      console.log(timeTaken)
      setStopTimer(true)
    }
  
if(timeTaken.length>0 && !quizComplete)
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
   
      <QuestionDisplay
        question={questions[currentQuestionIndex]}
        selectedAnswer={selectedAnswer}
        setSelectedAnswer={setSelectedAnswer}
        onSubmit={handleSubmit}
        isSubmitDisabled={answerSubmitted} // Pass answerSubmitted state
      />
    {showExplanationButton &&
    <div className="flex justify-evenly m-4 items-center space-x-2 px-4">
    <button
      onClick={() => setShowExplanation(prev => !prev)}
      className="flex items-center px-3 py-2 bg-zinc-800 text-zinc-400 hover:bg-gray-700 rounded"
    >
      See explanation <ChevronDown className="ml-2" />
    </button>
    <button
      onClick={handleNext}
      className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-sm"
    >
      Next
    </button>
  </div>
    }

{ showExplanation && <ExplanationDisplay
        explanation={questions[currentQuestionIndex].explanation}
        correctAnswer={questions[currentQuestionIndex].correctAnswer}
        selectedAnswer={selectedAnswer}
      />}
  
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