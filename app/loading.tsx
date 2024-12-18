'use client'
import Lottie from 'react-lottie-player'
import loadingAnimation from '@/public/animations/loading.json'

export default function Loading() {
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
