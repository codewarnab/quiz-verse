'use client'

import QuizComponent from "@/components/quizflow/QuizComponent"
import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"

export default function Home() {

  // const quizQuestion = useQuery(api.quizes.getQuestions)


  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 sm:p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Real-Time Quiz</h1>
      <QuizComponent />
    </main>
  )
}

