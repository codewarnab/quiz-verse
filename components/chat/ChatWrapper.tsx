"use client"

import { type Message, useChat } from "ai/react"
import { Messages } from "./Messages"
import { ChatInput } from "./ChatInput"

export const ChatWrapper = ({
    sessionId,
    initialMessages,
}: {
    sessionId: string
    initialMessages: Message[]
}) => {
    const { messages, handleInputChange, handleSubmit, input, setInput } = useChat({
        api: "/api/chat-stream",
        body: { sessionId },
        initialMessages,
    })

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-zinc-900">
            <div className="flex-1 overflow-hidden bg-zinc-800">
                <Messages messages={messages} />
            </div>

            <ChatInput input={input} handleInputChange={handleInputChange} handleSubmit={handleSubmit} setInput={setInput} />
        </div>
    )
}

