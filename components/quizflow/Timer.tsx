"use client"

import { useState, useEffect } from "react"

interface TimerProps {
  duration: number
  onTimerEnd: (elapsedTime: number) => void
  stop: boolean
}

export default function Timer({ duration, onTimerEnd, stop }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    setTimeLeft(duration)
  }, [duration])

  useEffect(() => {
    if (timeLeft > 0 && !stop) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timerId)
    } else {
      onTimerEnd(duration - timeLeft)
    }
  }, [timeLeft, stop])

  return (
    <div className="inline-flex items-center rounded bg-zinc-800 px-3 py-1 text-sm font-medium text-zinc-400">
      Time Left:<span className="ml-1 text-white">{timeLeft}s</span>
    </div>
  );
  
}

