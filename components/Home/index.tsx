"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomeContent() {
    const router = useRouter()

    useEffect(() => {
        router.push('/app')
    }, [router])

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
    )
}
