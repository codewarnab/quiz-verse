"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAction } from "convex/react"
import { api } from '@/convex/_generated/api'
import { useUser } from "@clerk/clerk-react"
import { useRouter } from 'next/navigation'


export default function TextInputPage() {
    const [text, setText] = useState("")
    const { user, isLoaded, isSignedIn } = useUser()
    const router = useRouter()
    const generateQuizfromText = useAction(api.actions.generateQuizfromText)
    const handleGenerateQuiz = async () => {
        if (!isSignedIn || !isLoaded) {
            return null;
        }
        try {
            const response = await generateQuizfromText({ text, userId: user!.id })
            console.log('Quiz generated:', response)
            if (response.success) {
                router.push("/app/quiz")
            }
        } catch (error) {
            console.error('Error generating quiz:', error)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#121212] text-white">
            <div className="w-full max-w-md space-y-4">
                <h1 className="text-2xl font-bold text-center mb-6">Generate Quiz from Text</h1>
                <Textarea
                    placeholder="Paste your text here..."
                    className="min-h-[200px] bg-[#1E1E1E] border-[#333333] text-white"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <Button onClick={handleGenerateQuiz} className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white">
                    : userDetails.quizgenStatus === "Idle"
                    ? "Create Quiz"
                            : userDetails.quizgenStatus}
                </Button>
            </div>
        </div>
    )
}

