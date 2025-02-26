"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card } from "@/components/ui/card";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const data = [
  { name: "Quiz 1", accuracy: 85 },
  { name: "Quiz 2", accuracy: 90 },
  { name: "Quiz 3", accuracy: 75 },
  { name: "Quiz 4", accuracy: 95 },
  { name: "Quiz 5", accuracy: 80 },
];

const pieData = [
  { name: "Correct", value: 400 },
  { name: "Wrong", value: 100 },
];

const COLORS = ["#4ade80", "#ef4444"];

export default function AnalyticsPage() {
  const { user } = useUser();
  const userDetails = useQuery(api.user.getUser, user?.id ? { clerkId: user.id } : "skip");

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-6">Analytics</h1>

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
        <h2 className="text-2xl font-bold mb-4">Accuracy</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" dataKey="value">
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card className="bg-[#1E1E1E] border-0 p-4 mb-6">
        <h2 className="text-2xl font-bold mb-4">Streak</h2>
        <div className="text-5xl font-bold text-green-500">{userDetails?.streak ?? 0} days</div>
      </Card>

      <Card className="bg-[#1E1E1E] border-0 p-4 mb-6">
        <h2 className="text-2xl font-bold mb-4">Total Quizzes</h2>
        <div className="text-5xl font-bold text-green-500">{userDetails?.quizzes?.length ?? 0}</div>
      </Card>
    </div>
  );
}
