import AuthGuard from '@/app/_components/AuthGuard'

export default function Main() {
  return (
    <AuthGuard>
      <div>
        <h1>메인 페이지</h1>
      </div>
    </AuthGuard>
  )
}
