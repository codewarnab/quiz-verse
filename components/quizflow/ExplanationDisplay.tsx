import { Button } from "@/components/ui/button"

interface ExplanationProps {
  explanation: string
  correctAnswer: string
  selectedAnswer: string | null
}

export default function ExplanationDisplay({ explanation, correctAnswer, selectedAnswer }: ExplanationProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 w-full max-w-2xl mx-auto shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Explanation</h2>
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
    </div>
  )
}