import { FiUser } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const scrollStyle = {
  base: 'bg-transparent text-black',
  scroll: 'bg-[#f7f2f2] text-black fixed w-full top-0 left-0 z-10 shadow-md',
}

export default function Header() {
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const headerScrollValid =
    scrollPosition === 0 ? scrollStyle.base : scrollStyle.scroll

  return (
    <>
      <header className={`${headerScrollValid}`}>
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4">
          <Link href="/main">
            <Image
              src="/imgs/logo.png"
              alt="Habit Tracker Illustration"
              width={200}
              height={100}
              priority
              className="w-[150px] md:w-[200px]"
            />
          </Link>
          <Link href="/my" className="text-black">
            <FiUser size={24} />
          </Link>
        </div>
      </header>
    </>
  )
}
