"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"

interface QuizCompleteProps {
  roomId: string
  correctAnswers: number
  wrongAnswers: number
  totalQuestions: number
}

export default function QuizComplete({
  roomId,
  correctAnswers,
  wrongAnswers,
  totalQuestions,
}: QuizCompleteProps) {
  const router = useRouter()
  const updateParticipants = useMutation(api.rooms.updateParticipant)

  // Reset values on mount (page reload) and update participant status
  useEffect(() => {
    if (roomId) {
      localStorage.setItem("currentQuestionIndex", "0")
      localStorage.setItem("correctAnswers", "0")
      localStorage.setItem("wrongAnswers", "0")
    }
  }, [roomId, updateParticipants])

  const goToLeaderBoard = async () => {
    // Log before calling mutation
    console.log("Calling updateParticipants mutation with roomId:", roomId)
    try {
      await updateParticipants({ roomId: roomId, status: "finished" })
      localStorage.setItem("currentQuestionIndex", "0")
      localStorage.setItem("correctAnswers", "0")
      localStorage.setItem("wrongAnswers", "0")
      router.push(`/app/leaderBoard/${roomId}`)
    } catch (error) {
      console.error("Error updating participant status:", error)
    }
  }

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
      className="w-full max-w-md mx-auto bg-zinc-800 text-white rounded-lg p-6 shadow-lg"
    >
      <h2 className="text-3xl font-bold text-center mb-6">
        Quiz Completed
      </h2>

      {/* Metrics in one horizontal axis */}
      <div className="flex justify-between text-center mb-6">
        <div>
          <span className="block text-green-500 text-2xl font-bold">
            {correctAnswers}
          </span>
          <span className="block text-sm text-gray-400">Correct</span>
        </div>
        <div>
          <span className="block text-red-500 text-2xl font-bold">
            {wrongAnswers}
          </span>
          <span className="block text-sm text-gray-400">Wrong</span>
        </div>
        <div>
          <span className="block text-zinc-400 text-2xl font-bold">
            {totalQuestions}
          </span>
          <span className="block text-sm text-gray-400">Total</span>
        </div>
      </div>

      <div className="text-center text-xl font-bold mb-6">
        Score: {score.toFixed(2)}%
      </div>

      <div className="w-full bg-zinc-700 rounded-full h-3 mb-6">
        <motion.div
          className="bg-green-600 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      {/* Donut Chart for a refined visual */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="value"
              paddingAngle={5}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <button
        onClick={goToLeaderBoard}
        className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold"
      >
        View Leaderboard
      </button>
    </motion.div>
  )
}