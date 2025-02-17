"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

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

  const score = (correctAnswers / totalQuestions) * 100

  const pieData = [
    { name: "Correct", value: correctAnswers },
    { name: "Wrong", value: wrongAnswers },
  ]

  const COLORS = ["#4ade80", "#ef4444"]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-zinc-900 p-8 rounded-lg w-full max-w-2xl mx-auto"
    >
      <h2 className="text-4xl font-bold mb-6 text-center">🎉 Quiz Completed! 🎉</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <p className="text-green-500 text-2xl">Correct Answers: {correctAnswers}</p>
          <p className="text-red-500 text-2xl">Wrong Answers: {wrongAnswers}</p>
          <p className="text-zinc-400 text-2xl">Total Questions: {totalQuestions}</p>
          <p className="text-3xl font-bold mt-4">Score: {score.toFixed(2)}%</p>
          <div className="w-full bg-zinc-800 rounded-full h-4 mt-4">
            <motion.div
              className="bg-green-600 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}

