"use client"

import { useState, useEffect } from "react"
import QuestionDisplay from "./QuestionDisplay"
import Timer from "./Timer"
import QuizComplete from "./QuizComplete"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: string
}

export default function QuizComponent() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [quizComplete, setQuizComplete] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [timerKey, setTimerKey] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState(0)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    // In a real application, this would be an API call
    const dummyQuestions: Question[] = [
      {
        id: 1,
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: "Paris",
      },
      {
        id: 2,
        question: "Which planet is known as the Red Planet?",
        options: ["Mars", "Venus", "Jupiter", "Saturn"],
        correctAnswer: "Mars",
      },
      {
        id: 3,
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        correctAnswer: "Pacific",
      },
      {
        id: 4,
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
        correctAnswer: "Leonardo da Vinci",
      },
      {
        id: 5,
        question: "What is the chemical symbol for gold?",
        options: ["Au", "Ag", "Fe", "Cu"],
        correctAnswer: "Au",
      },
    ]

    setQuestions(dummyQuestions)
    setIsLoading(false)
  }

  const handleSubmit = () => {
    if (selectedAnswer) {
      if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
        setCorrectAnswers((prev) => prev + 1)
      } else {
        setWrongAnswers((prev) => prev + 1)
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setTimerKey((prevKey) => prevKey + 1) // Reset timer
    } else {
      setQuizComplete(true)
    }
  }

  const handleTimerEnd = () => {
    if (!selectedAnswer) {
      setWrongAnswers((prev) => prev + 1)
    }
    handleSubmit()
  }

  if (isLoading) {
    return <div>Loading questions...</div>
  }

  if (quizComplete) {
    return (
      <QuizComplete correctAnswers={correctAnswers} wrongAnswers={wrongAnswers} totalQuestions={questions.length} />
    )
  }

  return (
    <div className="w-full max-w-2xl">
      <Timer key={timerKey} duration={50} onTimerEnd={handleTimerEnd} />
      <QuestionDisplay 
        question={questions[currentQuestionIndex]}
        selectedAnswer={selectedAnswer}
        setSelectedAnswer={setSelectedAnswer}
        onSubmit={handleSubmit}
      />
      <div className="mt-4 text-center">
        <span className="text-green-600 font-bold mr-4">Correct: {correctAnswers}</span>
        <span className="text-red-600 font-bold">Wrong: {wrongAnswers}</span>
      </div>
    </div>
  )
}

