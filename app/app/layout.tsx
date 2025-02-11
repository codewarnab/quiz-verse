import Link from "next/link"
import { Home, User } from "lucide-react"
import type React from "react" 

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-black text-white">
                {children}
                <nav className="fixed bottom-0 left-0 right-0 bg-[#1E1E1E] border-t border-[#333333] p-4">
                    <div className="flex justify-around items-center max-w-md mx-auto">
                        <Link href="/" className="flex flex-col items-center text-white">
                            <Home className="w-6 h-6" />
                            <span className="text-sm mt-1">Home</span>
                        </Link>
                        <Link href="/app/profile" className="flex flex-col items-center text-gray-400">
                            <User className="w-6 h-6" />
                            <span className="text-sm mt-1">Profile</span>
                        </Link>
                    </div>
                </nav>
            </body>
        </html>
    )
}

