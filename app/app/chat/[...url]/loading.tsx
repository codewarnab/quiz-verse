import React from 'react'
export default function Loading() {
    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-zinc-900">
            <div className="flex-1 overflow-hidden bg-zinc-800">
                <div className="h-full">
                    {/* Loading messages */}
                    <div className="space-y-4 p-4">
                        {/* User message skeleton */}
                        <div className="flex items-start gap-4">
                            <div className="size-8 rounded-full bg-zinc-700 animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-12 bg-zinc-700 rounded animate-pulse" />
                                <div className="h-16 w-[80%] bg-zinc-700 rounded animate-pulse" />
                            </div>
                        </div>

                        {/* AI message skeleton */}
                        <div className="flex items-start gap-4">
                            <div className="size-8 rounded-full bg-blue-700/50 animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-12 bg-zinc-700 rounded animate-pulse" />
                                <div className="space-y-2">
                                    <div className="h-4 w-[90%] bg-zinc-700 rounded animate-pulse" />
                                    <div className="h-4 w-[95%] bg-zinc-700 rounded animate-pulse" />
                                    <div className="h-4 w-[85%] bg-zinc-700 rounded animate-pulse" />
                                </div>
                            </div>
                        </div>

                        {/* User message skeleton */}
                        <div className="flex items-start gap-4">
                            <div className="size-8 rounded-full bg-zinc-700 animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-12 bg-zinc-700 rounded animate-pulse" />
                                <div className="h-12 w-[60%] bg-zinc-700 rounded animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Input area skeleton */}
            <div className="border-t border-zinc-700 bg-zinc-900">
                <div className="mx-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl p-2">
                    <div className="h-[72px] bg-zinc-800 rounded-xl animate-pulse" />
                </div>
            </div>
        </div>
    )
}

