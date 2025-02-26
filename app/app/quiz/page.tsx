'use client'

import QuizComponent from "@/components/quizflow/QuizComponent"

export default function Home() {

  // const quizQuestion = useQuery(api.quizes.getQuestions)


  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 sm:p-8">
      <QuizComponent />
    </main>
  )
}

