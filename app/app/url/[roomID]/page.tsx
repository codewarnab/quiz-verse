"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAction, useQuery } from "convex/react"
import { api } from '@/convex/_generated/api'
import { useUser } from "@clerk/clerk-react"
import QuizPreview from "@/components/Room Components/QuizPreview"

export default function CrawlerPage() {
    const [urls, setUrls] = useState([''])
    const { user, isSignedIn, isLoaded } = useUser();
    const [showPreview, setShowPreview] = useState(false)
    const [quizData, setQuizData] = useState<any>([])

    const userDetails = useQuery(
            api.user.getUser,
            user?.id ? { clerkId: user.id } : "skip"
    
        );

    // Use the Convex action "scrapUrls"
    const scrapUrls = useAction(api.actions.scrapUrls)

    const addUrlInput = () => {
        setUrls([...urls, ''])
    }

    const handleUrlChange = (index:any, value:any) => {
        const newUrls = [...urls]
        newUrls[index] = value
        setUrls(newUrls)
    }

    const startCrawl = async () => {
        const filteredUrls = urls.filter(url => url.trim() !== '')
        try {
            const response = await scrapUrls({ urls: filteredUrls, userId: user!.id })
            console.log('Crawl results:', response)
            console.log("user",userDetails)
            setQuizData(response.mcqResult)
            if(response.mcqResult)
            setShowPreview(true)

        } catch (error) {
            console.error('Error starting crawl:', error)
        }
    }

    if (!isSignedIn || !isLoaded) {
        return null;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Web Crawler</h1>
            {urls.map((url, index) => (
                <Input
                    key={index}
                    type="url"
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    placeholder="Enter URL"
                    className="mb-2"
                />
            ))}
            <Button onClick={addUrlInput} className="mb-4">
                Add URL
            </Button>
            <Button
                className="bg-[#4CAF50] hover:bg-[#45a049] text-white text-xl py-6 w-full max-w-xl mx-auto mt-8"
                disabled={
                    userDetails?.quizgenStatus !== "Idle"
                }
                onClick={startCrawl}
            >
              
                { userDetails?.quizgenStatus === "Idle"
                        ? "Create Quiz"
                        : userDetails?.quizgenStatus}
            </Button>

            
        {showPreview && <QuizPreview quiz={quizData} filesArray={[{ url: urls[0] }]} />}
            
        </div>
    )
}
