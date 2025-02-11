"use client";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, User, ChevronRight, BookmarkIcon, HelpCircle, LogOut } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ProfilePage() {
    const { user, isSignedIn, isLoaded } = useUser()


    const userDetails = useQuery(api.user.getUser, { clerkId: user?.id! })

    if (!isSignedIn || !isLoaded) {
        return null;
    }
    console.log(userDetails)

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="p-6 pb-2">
                <div className="text-sm mb-4">10:53</div>
                <h1 className="text-4xl font-bold">Profile</h1>
            </header>

            {/* Main Content */}
            <main className="p-6">
                {/* User Profile Section */}
                <div className="flex items-center gap-4 mb-6">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="John Doe" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-xl font-bold">John Doe</h2>
                        <p className="text-gray-400">john.doe@example.com</p>
                    </div>
                </div>

                {/* Tokens Card */}
                <Card className="bg-[#1E1E1E] border-0 p-4 mb-4">
                    <div className="mb-4">
                        <div className="text-sm text-gray-400">Tokens</div>
                        <div className="text-5xl font-bold my-2">1,516</div>
                        <div className="text-sm text-gray-400">1 Token = 1 Quiz Generation</div>
                    </div>
                    <Button variant="link" className="text-[#4CAF50] hover:text-[#45a049] p-0 h-auto flex items-center">
                        Get More
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </Card>

                {/* Menu Options */}
                <div className="space-y-3 mb-6">
                    <Button variant="ghost" className="w-full bg-[#1E1E1E] hover:bg-[#2C2C2C] justify-between h-14" asChild>
                        <Link href="/saved-questions">
                            <div className="flex items-center">
                                <BookmarkIcon className="w-5 h-5 text-[#4CAF50] mr-3" />
                                Saved Questions
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </Link>
                    </Button>

                    <Button variant="ghost" className="w-full bg-[#1E1E1E] hover:bg-[#2C2C2C] justify-between h-14" asChild>
                        <Link href="/support">
                            <div className="flex items-center">
                                <HelpCircle className="w-5 h-5 text-[#4CAF50] mr-3" />
                                Help & Support
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </Link>
                    </Button>
                </div>

                {/* Logout Button */}
                <Button className="w-full bg-[#1E1E1E] hover:bg-[#2C2C2C] text-[#FF4444] hover:text-[#FF6666] h-14">
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </Button>

                {/* Bottom Navigation */}
                <nav className="fixed bottom-0 left-0 right-0 bg-[#1E1E1E] border-t border-[#333333] p-4">
                    <div className="flex justify-around items-center max-w-md mx-auto">
                        <Link href="/" className="flex flex-col items-center text-gray-400">
                            <Home className="w-6 h-6" />
                            <span className="text-sm mt-1">Home</span>
                        </Link>
                        <Link href="/profile" className="flex flex-col items-center text-white">
                            <User className="w-6 h-6" />
                            <span className="text-sm mt-1">Profile</span>
                        </Link>
                    </div>
                </nav>
            </main>
        </div>
    );
}