'use client'
import { loginSchema } from '@/app/_utils/loginSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

type FormData = {
  id: string
  password: string
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    mode: 'all',
  })

  const onSubmit = (data: FormData) => {
    console.log('로그인 data:', data)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b px-4 text-center">
      <Link href={'/'}>
        <Image
          src="/imgs/logo.png"
          alt="Habit Tracker Illustration"
          width={400}
          height={300}
          priority
        />
      </Link>
      <div className="w-full max-w-[400px]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <input
            type="text"
            className="rounded-full border-2 border-green-30 bg-white px-4 py-2 outline-none"
            placeholder="아이디"
            {...register('id')}
          />
          {errors.id && (
            <p className="pl-4 text-left text-sm text-red-500">
              {errors.id.message}
            </p>
          )}

          <input
            type="password"
            className="rounded-full border-2 border-green-30 bg-white px-4 py-2 outline-none"
            placeholder="비밀번호"
            {...register('password')}
          />
          {errors.password && (
            <p className="pl-4 text-left text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
          <button
            type="submit"
            className="mt-4 rounded-full bg-green-30 px-6 py-2 text-white transition hover:bg-green-40"
          >
            로그인하기
          </button>
        </form>
        <div className="text-md mt-20 flex items-center justify-center gap-4">
          <p>회원이 아니신가요?</p>
          <Link
            href="/signup"
            className="text-green-40 underline decoration-green-40 underline-offset-2"
          >
            회원가입하기
          </Link>
        </div>
      </div>
    </div>
  )
}
