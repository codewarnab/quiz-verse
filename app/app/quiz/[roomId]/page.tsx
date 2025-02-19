'use client'
import RoomQuiz from "@/components/quizflow/RoomQuiz"
export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 sm:p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Real-Time Quiz</h1>
      <RoomQuiz />
    </main>
  )
}

