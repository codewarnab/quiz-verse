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

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-sky-700">{question.question}</h2>
      <div className="space-y-2 mb-4">
        {question.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            variant={selectedAnswer === option ? "default" : "outline"}
            className="w-full justify-start text-left"
          >
            {option}
          </Button>
        ))}
      </div>
      <Button onClick={onSubmit} disabled={!selectedAnswer} className="w-full hover:bg-gray-500 cursor-pointer">
        Submit
      </Button>
    </div>
  )
}

