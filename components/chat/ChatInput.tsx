"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import type { useChat } from "ai/react"

type HandleInputChange = ReturnType<typeof useChat>["handleInputChange"]
type HandleSubmit = ReturnType<typeof useChat>["handleSubmit"]
type SetInput = ReturnType<typeof useChat>["setInput"]

interface ChatInputProps {
    input: string
    handleInputChange: HandleInputChange
    handleSubmit: HandleSubmit
    setInput: SetInput
}

export const ChatInput = ({ handleInputChange, handleSubmit, input, setInput }: ChatInputProps) => {
    return (
        <div className="border-t border-zinc-700 bg-zinc-900 md:mb-0 mb-2">
            <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
                <div className="relative flex h-full flex-1 items-stretch md:flex-col">
                    <div className="relative flex flex-col w-full flex-grow p-4">
                        <form onSubmit={handleSubmit} className="relative">
                            <Textarea
                                rows={1}
                                autoFocus
                                onChange={handleInputChange}
                                value={input}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSubmit()
                                        setInput("")
                                    }
                                }}
                                placeholder="Enter your question..."
                                className="resize-none min-h-[100px] w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-base focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:ring-offset-0"
                            />

                            <Button
                                size="icon"
                                type="submit"
                                disabled={input.trim().length === 0}
                                className="absolute right-2 bottom-2 md:right-4 md:bottom-4 h-8 w-8 bg-white text-black hover:bg-gray-200"
                            >
                                <Send className="h-4 w-4 text-black" />
                                <span className="sr-only">Send message</span>
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

