import { Button } from "@/components/ui/button"

interface ExplanationProps {
  explanation: string
  correctAnswer: string
  selectedAnswer: string | null
  onNext: () => void
}

export default function ExplanationDisplay({ explanation, correctAnswer, selectedAnswer, onNext }: ExplanationProps) {
  return (
    <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Explanation</h2>
      <p className="mb-4">{explanation}</p>
      <div className="mb-4">
        <p className="font-semibold">
          Correct Answer: <span className="text-green-500">{correctAnswer}</span>
        </p>
        {selectedAnswer && (
          <p className="font-semibold">
            Your Answer:{" "}
            <span className={selectedAnswer === correctAnswer ? "text-green-500" : "text-red-500"}>
              {selectedAnswer}
            </span>
          </p>
        )}
      </div>
      <Button onClick={onNext} className="w-full bg-green-600 hover:bg-green-700 text-white">
        Next Question
      </Button>
    </div>
  )
}

