'use client'
import Lottie from 'react-lottie-player'
import notFoundAnimation from '@/public/animations/notFound.json'

export default function NotFoundAnimation() {
  return (
    <div>
      <Lottie
        loop
        animationData={notFoundAnimation}
        play
        style={{ width: 600, height: 400 }}
      />
    </div>
  )
}
