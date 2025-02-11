"use client";

import {
  Authenticated,
  Unauthenticated,
} from "convex/react";
import { SignInForm } from "@/components/SiginForm";
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



