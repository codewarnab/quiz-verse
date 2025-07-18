import type { Message as TMessage } from "ai/react"
import { Message } from "./Message"
import { MessageSquare } from "lucide-react"

interface MessagesProps {
  messages: TMessage[]
}

export const Messages = ({ messages }: MessagesProps) => {
  return (
    <div className="h-full overflow-y-auto">
      {messages.length ? (
        messages.map((message, i) => (
          <Message key={i} content={message.content} isUserMessage={message.role === "user"} />
        ))
      ) : (
        <div className="h-full flex flex-col items-center justify-center gap-2">
          <MessageSquare className="size-8 text-blue-500" />
          <h3 className="font-semibold text-xl text-white">You&apos;re all set!</h3>
          <p className="text-zinc-500 text-sm">Ask your first question to get started.</p>
        </div>
      )}
    </div>
  )
}

