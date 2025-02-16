import { Button } from "@/components/ui/button"

interface QuestionProps {
  question: {
    id: number
    question: string
    options: string[]
    correctAnswer: string
  }
  selectedAnswer: string | null
  setSelectedAnswer: (answer: string) => void
  onSubmit: () => void
}

export default function QuestionDisplay({ question, selectedAnswer, setSelectedAnswer, onSubmit }: QuestionProps) {
  const handleAnswerSelect = (option: string) => {
    setSelectedAnswer(option)
  }

  const letters = ["A", "B", "C", "D"]

  return (
    <div className="bg-zinc-900 rounded-lg p-6 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">{question.question}</h2>
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            variant="outline"
            className={`w-full justify-start text-left h-auto py-4 px-6 bg-zinc-800 hover:bg-zinc-700 border-zinc-700
              ${selectedAnswer === option ? "bg-green-600 hover:bg-green-700 text-white border-green-500" : ""}`}
          >
            <span className={`mr-3 ${selectedAnswer === option ? "text-white" : "text-green-500"}`}>
              {letters[index]}
            </span>
            {option}
          </Button>
        ))}
      </div>
      <Button
        onClick={onSubmit}
        disabled={!selectedAnswer}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        Submit
      </Button>
    </div>
  )
}

