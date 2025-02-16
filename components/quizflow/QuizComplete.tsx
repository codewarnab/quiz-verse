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
    <div
      className={`bg-zinc-900 p-8 rounded-lg transition-opacity duration-1000 ${visible ? "opacity-100" : "opacity-0"} w-full max-w-2xl mx-auto`}
    >
      <h2 className="text-4xl font-bold mb-6 text-center">🎉 Quiz Completed! 🎉</h2>
      <div className="space-y-4 text-center">
        <p className="text-green-500 text-2xl">Correct Answers: {correctAnswers}</p>
        <p className="text-red-500 text-2xl">Wrong Answers: {wrongAnswers}</p>
        <p className="text-zinc-400 text-2xl">Total Questions: {totalQuestions}</p>
        <p className="text-xl font-bold mt-4">Score: {((correctAnswers / totalQuestions) * 100).toFixed(2)}%</p>
        <div className="w-full bg-zinc-800 rounded-full h-2 mt-4">
          <div
            className="bg-green-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${(correctAnswers / totalQuestions) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

