import dynamic from 'next/dynamic'
import Link from 'next/link'
import notFoundAnimation from '@/public/animations/notFound.json'

const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false })

export default function NotFound() {
  return (
    <div className="mb-10 flex min-h-screen w-full max-w-full flex-col items-center justify-center overflow-hidden">
      <Lottie
        loop
        animationData={notFoundAnimation}
        play
        style={{ width: 600, height: 400 }}
      />
      <p className="text-lg text-gray-500">페이지를 찾을 수 없습니다.</p>
      <Link
        href="/main"
        className="mt-4 rounded-full bg-green-30 px-6 py-2 text-xl font-semibold text-white transition hover:bg-green-40"
      >
        Go To Main
      </Link>
    </div>
  )
}
