"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, Group, MessageSquare } from "lucide-react"
import type React from "react"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    const isActive = (path: string) => {
        if (path === "/" && pathname === "/") return true
        if (path !== "/" && pathname.startsWith(path)) return true
        return false
    }

    return (
        <html lang="en">
            <body className="min-h-screen bg-black text-white">
                {children}
                <nav className="fixed bottom-0 left-0 right-0 bg-[#1E1E1E] border-t border-[#333333] p-4">
                    <div className="flex justify-around items-center max-w-md mx-auto">
                        <Link href="/app" className={`flex flex-col items-center ${isActive("/app") ? "text-white" : "text-gray-400"}`}>
                            <Home className="w-6 h-6" />
                            <span className="text-sm mt-1">Home</span>
                        </Link>
                        <Link
                            href="/app/room"
                            className={`flex flex-col items-center ${isActive("/app/room") ? "text-white" : "text-gray-400"}`}
                        >
                            <Group className="w-6 h-6" />
                            <span className="text-sm mt-1">Room</span>
                        </Link>
                        <Link
                            href="/app/chat"
                            className={`flex flex-col items-center ${isActive("/app/chat") ? "text-white" : "text-gray-400"}`}
                        >
                            <MessageSquare className="w-6 h-6" />
                            <span className="text-sm mt-1">Chat</span>
                        </Link>
                        <Link
                            href="/app/profile"
                            className={`flex flex-col items-center ${isActive("/app/profile") ? "text-white" : "text-gray-400"}`}
                        >
                            <User className="w-6 h-6" />
                            <span className="text-sm mt-1">Profile</span>
                        </Link>
                    </div>
                </nav>
            </body>
        </html>
    )
}

