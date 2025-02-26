import { Button } from "@/components/ui/button"

interface ExplanationProps {
  explanation: string
  correctAnswer: string
  selectedAnswer: string | null
  onNext: () => void
}

export default function ExplanationDisplay({ explanation, correctAnswer, selectedAnswer, onNext }: ExplanationProps) {
  return (
    <div className="bg-[#1A1A1A] rounded-lg p-6 w-full max-w-2xl mx-auto shadow-lg sm:p-8">
      <h2 className="text-2xl font-bold text-white mb-4 sm:text-3xl">Explanation</h2>
      <p className="text-gray-300 mb-4">{explanation}</p>
      <div className="mb-4">
        <p className="font-semibold text-white">
          Correct Answer: <span className="text-green-500">{correctAnswer}</span>
        </p>
        {selectedAnswer && (
          <p className="font-semibold text-white">
            Your Answer:{" "}
            <span className={selectedAnswer === correctAnswer ? "text-green-500" : "text-red-500"}>
              {selectedAnswer}
            </span>
          </p>
        )}
      </div>
      <Button
        onClick={onNext}
        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white"
      >
        Next Question
      </Button>
    </div>
  )
}

