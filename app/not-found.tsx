export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1000px] flex-col items-center justify-center gap-4 px-10">
      <h1 className="text-2xl font-semibold">페이지를 찾을 수 없습니다.</h1>
      <button className="w-full max-w-[500px] rounded-full bg-green-30 px-6 py-3 text-white shadow-lg transition hover:bg-green-40">
        홈으로 가기
      </button>
    </div>
  )
}
