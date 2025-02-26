"use client";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Home,
  User,
  ChevronRight,
  BookmarkIcon,
  HelpCircle,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Quiz 1", accuracy: 85 },
  { name: "Quiz 2", accuracy: 90 },
  { name: "Quiz 3", accuracy: 75 },
  { name: "Quiz 4", accuracy: 95 },
  { name: "Quiz 5", accuracy: 80 },
];

export default function ProfilePage() {
  const { user, isSignedIn, isLoaded } = useUser();

  // Ensure user is loaded and has an id before making the query
  const userDetails = useQuery(
    api.user.getUser,
    user?.id ? { clerkId: user.id } : "skip",
  );

  if (!isSignedIn || !isLoaded) {
    return null;
  }

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
            <AvatarImage
              src={user?.profileImageUrl || "https://github.com/shadcn.png"}
              alt={user?.fullName || "User"}
            />
            <AvatarFallback>
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{user?.fullName || "User"}</h2>
            <p className="text-gray-400">
              {user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
        </div>

        {/* Tokens Card */}
        <Card className="bg-[#1E1E1E] border-0 p-4 mb-4">
          <div className="mb-4">
            <div className="text-sm text-gray-400">Tokens</div>
            <div className="text-5xl font-bold my-2">
              {userDetails?.tokens ?? 0}
            </div>
            <div className="text-sm text-gray-400">
              1 Token = 1 Quiz Generation
            </div>
          </div>
          <Button
            variant="link"
            className="text-[#4CAF50] hover:text-[#45a049] p-0 h-auto flex items-center"
          >
            Get More
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Card>

        {/* Menu Options */}
        <div className="space-y-3 mb-6">
          <Button
            variant="ghost"
            className="w-full bg-[#1E1E1E] hover:bg-[#2C2C2C] justify-between h-14"
            asChild
          >
            <Link href="/saved-questions">
              <div className="flex items-center">
                <BookmarkIcon className="w-5 h-5 text-[#4CAF50] mr-3" />
                Saved Questions
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          </Button>

          <Button
            variant="ghost"
            className="w-full bg-[#1E1E1E] hover:bg-[#2C2C2C] justify-between h-14"
            asChild
          >
            <Link href="/support">
              <div className="flex items-center">
                <HelpCircle className="w-5 h-5 text-[#4CAF50] mr-3" />
                Help & Support
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          </Button>
        </div>

        {/* Analytics Section */}
        <Card className="bg-[#1E1E1E] border-0 p-4 mb-6">
          <h2 className="text-2xl font-bold mb-4">Accuracy Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="accuracy" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="bg-[#1E1E1E] border-0 p-4 mb-6">
          <h2 className="text-2xl font-bold mb-4">Streak</h2>
          <div className="text-5xl font-bold text-green-500">
            {userDetails?.streak ?? 0} days
          </div>
        </Card>

        <Card className="bg-[#1E1E1E] border-0 p-4 mb-6">
          <h2 className="text-2xl font-bold mb-4">Total Quizzes</h2>
          <div className="text-5xl font-bold text-green-500">
            {userDetails?.quizzes?.length ?? 0}
          </div>
        </Card>
        <Card className="bg-[#1E1E1E] border-0 p-4 mb-20">
          <SignOutButton>
            <Button
              className="w-full bg-gray-700 hover:bg-gray-600 text-white border-none"
              variant="outline"
              size="lg"
            >
              Logout
            </Button>
          </SignOutButton>
        </Card>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-[#1E1E1E] border-t border-[#333333] p-4">
          <div className="flex justify-around items-center max-w-md mx-auto">
            <Link href="/" className="flex flex-col items-center text-gray-400">
              <Home className="w-6 h-6" />
              <span className="text-sm mt-1">Home</span>
            </Link>
            <Link
              href="/profile"
              className="flex flex-col items-center text-white"
            >
              <User className="w-6 h-6" />
              <span className="text-sm mt-1">Profile</span>
            </Link>
          </div>
        </nav>
      </main>
    </div>
  );
}
