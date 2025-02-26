"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAction } from "convex/react"
import { api } from '@/convex/_generated/api'
import { useUser } from "@clerk/clerk-react"

export default function CrawlerPage() {
    const [urls, setUrls] = useState([''])
    const [isLoading, setIsLoading] = useState(false)
    const { user, isSignedIn, isLoaded } = useUser();


    // Use the Convex action "scrapUrls"
    const scrapUrls = useAction(api.actions.scrapUrls)

    const addUrlInput = () => {
        setUrls([...urls, ''])
    }

    const handleUrlChange = (index, value) => {
        const newUrls = [...urls]
        newUrls[index] = value
        setUrls(newUrls)
    }

    const startCrawl = async () => {
        setIsLoading(true)
        const filteredUrls = urls.filter(url => url.trim() !== '')

        try {
            const response = await scrapUrls({ urls: filteredUrls, userId: user!.id })
            console.log('Crawl results:', response)
        } catch (error) {
            console.error('Error starting crawl:', error)
        } finally {
            setIsLoading(false)
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
            <Button onClick={startCrawl} disabled={isLoading} className="ml-2 mb-4">
                {isLoading ? 'Crawling...' : 'Start Crawl'}
            </Button>
        </div>
    )
}
