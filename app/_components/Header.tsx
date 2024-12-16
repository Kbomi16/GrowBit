import { FiUser } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-transparent py-4 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
        <Link href="/main">
          <Image
            src="/imgs/logo.png"
            alt="Habit Tracker Illustration"
            width={200}
            height={300}
            priority
          />
        </Link>
        <Link href="/my" className="text-black">
          <FiUser size={24} />
        </Link>
      </div>
    </header>
  )
}
