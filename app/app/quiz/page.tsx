import QuizComponent from "@/components/quizflow/QuizComponent"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-blue-600">Real-Time Quiz</h1>
      <QuizComponent />
    </main>
  )
}

