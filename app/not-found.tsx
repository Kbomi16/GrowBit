import Link from 'next/link'
import NotFoundAnimation from './_components/NotFoundAnimation'

export default function NotFound() {
  return (
    <div className="mb-10 flex min-h-screen w-full max-w-full flex-col items-center justify-center overflow-hidden">
      <NotFoundAnimation />
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
