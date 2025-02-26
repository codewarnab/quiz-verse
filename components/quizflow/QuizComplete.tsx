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
      // Reset values before navigating to leaderboard
      await updateParticipants({ roomId: roomId, status: "finished" })
      console.log("Participant status updated to finished")
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
      className="w-full max-w-md mx-auto bg-[#1A1A1A] text-white rounded-lg p-4 md:p-6"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
        Quiz Completed
      </h2>

      {/* Metrics in one horizontal axis */}
      <div className="flex justify-between text-center">
        <div>
          <span className="block text-green-500 text-xl font-bold">
            {correctAnswers}
          </span>
          <span className="block text-sm text-gray-300">Correct</span>
        </div>
        <div>
          <span className="block text-red-500 text-xl font-bold">
            {wrongAnswers}
          </span>
          <span className="block text-sm text-gray-300">Wrong</span>
        </div>
        <div>
          <span className="block text-zinc-400 text-xl font-bold">
            {totalQuestions}
          </span>
          <span className="block text-sm text-gray-300">Total</span>
        </div>
      </div>

      <div className="mt-4 text-center text-lg font-bold">
        Score: {correctAnswers.toFixed(2)}
      </div>

      <div className="w-full bg-zinc-800 rounded-full h-3 mt-2">
        <motion.div
          className="bg-green-600 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>

      {/* Donut Chart for a refined visual */}
      <div className="mt-6">
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              dataKey="value"
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
        className="mt-4 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold"
      >
        View Leaderboard
      </button>
    </motion.div>
  )
}
