export default function Footer() {
  return (
    <footer className="w-full bg-green-50 py-8 text-white">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm">&copy; 2024 GrowBit. All rights reserved.</p>

          <nav className="flex flex-col items-center justify-center space-y-2 text-sm md:flex-row md:space-x-6 md:space-y-0">
            <p className="pointer-events-none hover:text-gray-400">
              개인정보처리방침
            </p>
            <p className="pointer-events-none hover:text-gray-400">
              서비스 약관
            </p>
            <p className="pointer-events-none hover:text-gray-400">연락처</p>
          </nav>
        </div>
      </div>
    </footer>
  )
}
