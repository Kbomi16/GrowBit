'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b px-4 text-center">
      <motion.div
        className="mt-10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Image
          src="/imgs/logo.png"
          alt="Habit Tracker Illustration"
          width={400}
          height={300}
          priority
        />
      </motion.div>
      <motion.p
        className="mt-4 text-lg text-slate-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        당신의 성장을 돕는 스마트한 방법, GrowBit에서 시작하세요.
      </motion.p>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="mt-8"
      >
        <Link href="/login">
          <button className="mt-4 rounded-full bg-green-30 px-6 py-2 text-2xl font-semibold text-white transition hover:bg-green-40">
            시작하기{' '}
          </button>
        </Link>
      </motion.div>
    </div>
  )
}
