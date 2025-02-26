"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUser } from "@clerk/clerk-react"
import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Globe, ArrowRight, History, ExternalLink } from "lucide-react"

export default function WebsiteChatPage() {
    const [url, setUrl] = useState("")
    const router = useRouter()
    const { user, isSignedIn, isLoaded } = useUser()

    // Ensure user is loaded and has an id before making the query
    const userDetails = useQuery(api.user.getUser, user?.id ? { clerkId: user.id } : "skip")

    if (!isSignedIn || !isLoaded) {
        return null
    }

    const handleStartChat = () => {
        if (url) {
            const encodedUrl = encodeURIComponent(url)
            router.push(`/app/chat/${encodedUrl}`)
        }
    }

    const handlePreviousChatClick = (chatUrl: string) => {
        const encodedUrl = encodeURIComponent(chatUrl)
        router.push(`/app/chat/${encodedUrl}`)
    }

    // Function to extract domain from URL for display
    const extractDomain = (url: string) => {
        try {
            const domain = new URL(url).hostname
            return domain
        } catch {
            return url
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#121212] to-[#1a1a1a] text-white">
            <Card className="w-full max-w-md border-0 bg-[#1E1E1E] shadow-xl">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-center mb-2">
                        <div className="w-12 h-12 rounded-full bg-[#4CAF50]/20 flex items-center justify-center">
                            <Globe className="w-6 h-6 text-[#4CAF50]" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Chat with Website</CardTitle>
                    <CardDescription className="text-center text-zinc-400">
                        Enter a URL to start chatting with any website
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative">
                        <Input
                            type="url"
                            placeholder="https://example.com"
                            className="bg-[#252525] border-[#333333] text-white pl-4 pr-12 h-12 rounded-lg focus:ring-[#4CAF50] focus:border-[#4CAF50] transition-all"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleStartChat()}
                        />
                        {url && (
                            <button
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4CAF50] hover:text-[#45a049] transition-colors"
                                onClick={() => setUrl("")}
                            >
                                <span className="sr-only">Clear</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        )}
                    </div>

                    <Button
                        onClick={handleStartChat}
                        className="w-full h-12 bg-[#4CAF50] hover:bg-[#45a049] text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#4CAF50]/20"
                        disabled={!url}
                    >
                        Start Chat
                        <ArrowRight className="w-4 h-4" />
                    </Button>

                    {userDetails?.chatUrls && userDetails.chatUrls.length > 0 && (
                        <div className="mt-8 space-y-3">
                            <div className="flex items-center gap-2">
                                <History className="w-4 h-4 text-zinc-400" />
                                <h2 className="text-lg font-semibold">Previous Chats</h2>
                            </div>

                            <ScrollArea className="h-[240px] w-full rounded-lg border border-[#333333] bg-[#252525] p-2">
                                <div className="space-y-1.5">
                                    {userDetails.chatUrls.map((chatUrl, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handlePreviousChatClick(chatUrl)}
                                            className="w-full text-left p-3 rounded-lg hover:bg-[#333333] transition-colors duration-200 flex items-center gap-2 group"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center flex-shrink-0">
                                                <Globe className="w-4 h-4 text-zinc-300" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-zinc-200 truncate">{extractDomain(chatUrl)}</p>
                                                <p className="text-xs text-zinc-400 truncate">{chatUrl}</p>
                                            </div>
                                            <ExternalLink className="w-4 h-4 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </CardContent>
            </Card>

            <p className="text-xs text-zinc-500 mt-6 text-center max-w-md">
                Chat with any website by entering its URL above. Your previous chats will be saved for easy access.
            </p>
        </div>
    )
}

