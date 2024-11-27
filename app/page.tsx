import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex w-full max-w-[1200px] flex-col items-center justify-center">
      <h1 className="text-6xl">GrowBit</h1>
      <p>랜딩페이지</p>
      <Link href="/login">
        <button className="w-fit rounded-full bg-slate-950 px-2 text-white">
          시작하기
        </button>
      </Link>
    </div>
  )
}
