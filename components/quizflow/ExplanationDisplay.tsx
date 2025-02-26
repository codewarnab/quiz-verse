import { Button } from "@/components/ui/button"

interface Question {
  correctAnswer: string
}

interface ExplanationProps {
  explanations: string[]
  questions: Question[]
  onNext: () => void
}

export default function ExplanationDisplay({ explanations, questions, onNext }: ExplanationProps) {
  return (
    <div className="bg-[#1A1A1A] rounded-lg p-6 w-full max-w-2xl mx-auto shadow-lg sm:p-8">
      <h2 className="text-2xl font-bold text-white mb-4 sm:text-3xl">Explanations</h2>
      {explanations.map((explanation, index) => (
        <div key={index} className="mb-4">
          <p className="text-gray-300 mb-2">{explanation}</p>
          <p className="font-semibold text-white">
            Correct Answer: <span className="text-green-500">{questions[index].correctAnswer}</span>
          </p>
        </div>
      ))}
      <Button
        onClick={onNext}
        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white"
      >
        Stats
      </Button>
    </div>
  )
}

