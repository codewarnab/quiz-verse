import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Camera, FileText, File, ChevronRight, Link2Icon } from "lucide-react"

export default function HomePage() {
    return (
        <div className="min-h-screen pb-20">
            {/* Added pb-20 to account for the fixed nav */}
            {/* Header */}
            <header className="p-6 pb-2">
                <h1 className="text-4xl font-bold">Home</h1>
            </header>
            {/* Main Content */}
            <main className="p-6">
                <h2 className="text-2xl mb-4">Generate a quiz from</h2>

                {/* Quiz Generation Options */}
                <div className="space-y-4 mb-8">
                    <Card className="bg-[#4CAF50] hover:bg-[#45a049] transition-colors cursor-pointer border-0">
                        <Link href="/app/text" className="block p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Text</h3>
                                    <p className="text-white/80">Paste or type text content</p>
                                </div>
                                <FileText className="w-8 h-8 text-white" />
                            </div>
                        </Link>
                    </Card>

                    <Card className="bg-[#4CAF50] hover:bg-[#45a049] transition-colors cursor-pointer border-0">
                        <Link href="/app/upload" className="block p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Photo</h3>
                                    <p className="text-white/80">Upload images of text or documents</p>
                                </div>
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </Link>
                    </Card>

                        
                    <Card className="bg-[#4CAF50] hover:bg-[#45a049] transition-colors cursor-pointer border-0">
                        <Link href="/app/upload" className="block p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">PDF</h3>
                                    <p className="text-white/80">Upload PDF files (max 5000 words)</p>
                                </div>
                                <File className="w-8 h-8 text-white" />
                            </div>
                        </Link>
                    </Card>
                    <Card className="bg-[#4CAF50] hover:bg-[#45a049] transition-colors cursor-pointer border-0">
                        <Link href="/app/url" className="block p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">URL</h3>
                                    <p className="text-white/80">Paste a website URL</p>
                                </div>
                                <Link2Icon className="w-8 h-8 text-white" />
                            </div>
                        </Link>
                    </Card>
                </div>

                {/* Saved Quizzes Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl">Saved Quizzes</h2>
                        <Link href="#" className="text-[#2196F3] flex items-center">
                            View All
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        <Card className="bg-[#1E1E1E] border-0 p-4">
                            <h3 className="text-xl font-bold mb-2">Indian Geography</h3>
                            <div className="text-sm text-gray-400 mb-3">Jan 11, 2025</div>
                            <div className="grid grid-cols-3 gap-4 mb-3">
                                <div>
                                    <div className="flex items-center gap-1 mb-1">
                                        <span className="text-[#FFD700]">★</span> 5/15
                                    </div>
                                    <div className="text-sm text-gray-400">Score</div>
                                </div>
                                <div>
                                    <div className="mb-1">15</div>
                                    <div className="text-sm text-gray-400">Questions</div>
                                </div>
                                <div>
                                    <div className="mb-1">56.0s</div>
                                    <div className="text-sm text-gray-400">Time</div>
                                </div>
                            </div>
                            <Progress value={33} className="bg-[#333333] h-2" indicatorClassName="bg-[#4CAF50]" />
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}

