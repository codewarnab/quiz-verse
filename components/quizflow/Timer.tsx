"use client"

import { useState, useEffect } from "react"

interface TimerProps {
  duration: number
  onTimerEnd: () => void
}

export default function Timer({ duration, onTimerEnd }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    setTimeLeft(duration)
  }, [duration])

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timerId)
    } else {
      onTimerEnd()
    }
  }, [timeLeft, onTimerEnd])

  return <div className="text-xl font-bold mb-4 text-zinc-400">Time left: {timeLeft} seconds</div>
}

