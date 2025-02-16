'use client'
import Lottie from 'lottie-react'
import loadingAnimation from '@/public/animations/loading.json'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f7f2f2]">
      <Lottie
        loop
        animationData={loadingAnimation}
        style={{ width: 500, height: 500 }}
      />
    </div>
  )
}
