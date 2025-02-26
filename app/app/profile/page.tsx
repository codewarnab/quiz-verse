"use client"

import Link from "next/link"
import { SignOutButton } from "@clerk/nextjs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, BookmarkIcon, HelpCircle, LogOut } from "lucide-react"
import { useUser } from "@clerk/clerk-react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Quiz 1", accuracy: 85 },
  { name: "Quiz 2", accuracy: 90 },
  { name: "Quiz 3", accuracy: 75 },
  { name: "Quiz 4", accuracy: 95 },
  { name: "Quiz 5", accuracy: 80 },
]

export default function ProfilePage() {
  const { user, isSignedIn, isLoaded } = useUser()

  const userDetails = useQuery(api.user.getUser, user?.id ? { clerkId: user.id } : "skip")

  if (!isSignedIn || !isLoaded) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-black p-4 border-b border-zinc-800">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Profile</h1>
          <SignOutButton>
            <Button className="bg-red-600 hover:bg-red-700 text-white border-none" variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </SignOutButton>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 pb-20">
        {/* User Profile Section */}
        <Card className="bg-[#1E1E1E] border border-zinc-700 p-4 mb-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.imageUrl || "https://github.com/shadcn.png"} alt={user?.fullName || "User"} />
            </Avatar>
            <div>
              <h2 className="text-lg font-bold">{user?.fullName || "User"}</h2>
              <p className="text-sm text-gray-400">{user?.emailAddresses[0]?.emailAddress}</p>
            </div>
          </div>
        </Card>

        {/* Tokens Card */}
        <Card className="bg-[#1E1E1E] border border-zinc-700 p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-400">Tokens</div>
              <div className="text-3xl font-bold my-1">{userDetails?.tokens ?? 0}</div>
              <div className="text-xs text-gray-400">1 Token = 1 Quiz Generation</div>
            </div>
            <Button variant="link" className="text-[#4ade80] hover:text-[#45a049] p-0 h-auto flex items-center">
              Get More
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </Card>

        {/* Menu Options */}
        <div className="space-y-2 mb-4">
          <Button variant="ghost" className="w-full bg-[#1E1E1E] hover:bg-[#2C2C2C] justify-between h-12" asChild>
            <Link href="/app/saved-questions">
              <div className="flex items-center">
                <BookmarkIcon className="w-5 h-5 text-[#4ade80] mr-2" />
                Saved Questions
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          </Button>

          <Button variant="ghost" className="w-full bg-[#1E1E1E] hover:bg-[#2C2C2C] justify-between h-12" asChild>
            <Link href="/app/support">
              <div className="flex items-center">
                <HelpCircle className="w-5 h-5 text-[#4ade80] mr-2" />
                Help & Support
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          </Button>
        </div>

        {/* Analytics Section */}
        <Card className="bg-[#1E1E1E] border border-zinc-700 p-4 mb-4">
          <h2 className="text-xl font-semibold mb-3">Quiz Accuracy Over Time</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="accuracy" fill="#4ade80" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card className="bg-[#1E1E1E] border border-zinc-700 p-4">
            <h2 className="text-sm font-semibold mb-2">Streak</h2>
            <div className="text-2xl font-bold text-[#4ade80]">{0} days</div>
          </Card>

          <Card className="bg-[#1E1E1E] border border-zinc-700 p-4">
            <h2 className="text-sm font-semibold mb-2">Total Quizzes</h2>
            <div className="text-2xl font-bold text-[#4ade80]">{userDetails?.quizzes?.length ?? 0}</div>
          </Card>
        </div>
      </main>
    </div>
  )
}

