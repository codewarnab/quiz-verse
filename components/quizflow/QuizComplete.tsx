"use client"

import { useEffect, useState } from "react"

interface QuizCompleteProps {
  correctAnswers: number
  wrongAnswers: number
  totalQuestions: number
}

export default function QuizComplete({ correctAnswers, wrongAnswers, totalQuestions }: QuizCompleteProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <div className={`text-center transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"}`}>
      <h2 className="text-4xl font-bold mb-4">🎉 Quiz Completed! 🎉</h2>
      <div className="text-2xl">
        <p className="text-green-600">Correct Answers: {correctAnswers}</p>
        <p className="text-red-600">Wrong Answers: {wrongAnswers}</p>
        <p className="text-blue-600">Total Questions: {totalQuestions}</p>
        <p className="font-bold mt-4">Score: {((correctAnswers / totalQuestions) * 100).toFixed(2)}%</p>
      </div>
    </div>
  )
}

