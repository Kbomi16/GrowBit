'use client'
import { useEffect, useState } from 'react'
import Lottie from 'react-lottie-player'
import loadingAnimation from '@/public/animations/loading.json'

export default function Loading() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <Lottie
        loop
        animationData={loadingAnimation}
        play
        style={{ width: 500, height: 500 }}
      />
    </div>
  )
}
