"use client";

import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { api } from "../convex/_generated/api";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { SignInForm } from "@/components/SiginForm";
import { BookOpen } from "lucide-react";
import HomeContent from "@/components/Home";


export default function Home() {
  return (
    <div className="min-h-screen bg-background bg-gray-900">

      <main className="container py-8 flex flex-col gap-8 h-full">
        <Authenticated >
          <HomeContent />
        </Authenticated>
        <Unauthenticated >
          <SignInForm />
        </Unauthenticated>
      </main>
    </div>
  )
}



