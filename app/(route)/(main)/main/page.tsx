import AuthGuard from '@/app/_components/AuthGuard'
import Link from 'next/link'

export default function Main() {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b px-4 text-center">
        <div className="mt-12 flex w-full flex-col items-center justify-center">
          {/* 습관 달성률 표시 */}
          <div className="mb-6 w-full max-w-[600px] rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">오늘의 습관 달성률</h2>
            <div className="flex items-center justify-between">
              <p className="text-lg">총 목표 달성률</p>
              <div className="font-bold text-xl text-green-40">85%</div>
            </div>
          </div>

          {/* 습관 목록 */}
          <div className="w-full max-w-[600px] rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">내 습관</h2>
            <ul className="space-y-4">
              {/* 습관 카드 */}
              <li className="flex items-center justify-between border-b py-4">
                <p>운동하기</p>
                <Link
                  href="/habit-detail"
                  className="text-green-40 hover:underline"
                >
                  상세보기
                </Link>
              </li>
              <li className="flex items-center justify-between border-b py-4">
                <p>매일 읽기</p>
                <Link
                  href="/habit-detail"
                  className="text-green-40 hover:underline"
                >
                  상세보기
                </Link>
              </li>
              {/* 추가된 습관 */}
            </ul>
          </div>

          <div className="mt-6">
            <Link href="/addHabit">
              <button className="rounded-full bg-green-30 px-6 py-3 text-white shadow-lg transition hover:bg-green-40">
                습관 추가
              </button>
            </Link>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
