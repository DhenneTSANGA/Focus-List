"use client"

import { useEffect, useState } from "react"

interface TasksProgressProps {
  completionRate: number
}

export default function TasksProgress({ completionRate }: TasksProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(completionRate)
    }, 100)

    return () => clearTimeout(timer)
  }, [completionRate])

  return (
    <div className="relative pt-1">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold inline-block text-primary">Progression</span>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold inline-block text-primary">{progress}%</span>
        </div>
      </div>
      <div className="overflow-hidden h-6 mb-4 text-xs flex rounded-full bg-muted/50 mt-1">
        <div
          style={{ width: `${progress}%` }}
          className="transition-all duration-1000 ease-out shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-primary to-violet-500 rounded-full"
        ></div>
      </div>
    </div>
  )
}
