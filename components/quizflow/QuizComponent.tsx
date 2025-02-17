"use client"

import { useState, useEffect } from "react"
import QuestionDisplay from "./QuestionDisplay"
import Timer from "./Timer"
import QuizComplete from "./QuizComplete"
import ExplanationDisplay from "./ExplanationDisplay"
import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"

interface Question {
  correctAnswer: string
  explanation: string
  options: string[]
  question: string
}

export default function QuizComponent() {

  const quizQuestion = useQuery(api.quizes.getQuestions)

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [quizComplete, setQuizComplete] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState(0)


  useEffect(() => {
    if (quizQuestion) {
      fetchQuestions()
    }
  }, [quizQuestion])

  const fetchQuestions = async () => {
    const dummyQuestions: Question[] = quizQuestion ?? []

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
      setShowExplanation(true)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setTimerKey((prevKey) => prevKey + 1)
    } else {
      setQuizComplete(true)
    }
  }

  const handleTimerEnd = () => {
    if (!selectedAnswer) {
      setWrongAnswers((prev) => prev + 1)
    }
    setShowExplanation(true)
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
      <QuizComplete correctAnswers={correctAnswers} wrongAnswers={wrongAnswers} totalQuestions={questions.length} />
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!showExplanation && <Timer key={timerKey} duration={50} onTimerEnd={handleTimerEnd} />}
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
      <div className="mt-4 text-center space-x-4">
        <span className="text-green-500">Correct: {correctAnswers}</span>
        <span className="text-red-500">Wrong: {wrongAnswers}</span>
      </div>
    </div>
  )
}

