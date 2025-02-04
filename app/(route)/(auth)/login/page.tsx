'use client'
import { auth } from '@/app/_libs/firebaseConfig'
import { loginSchema } from '@/app/_utils/loginSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { FirebaseError } from 'firebase/app'
import { signInWithEmailAndPassword } from 'firebase/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { setCookie } from 'cookies-next'
import { useState } from 'react'
import Loading from '@/app/loading'

type FormData = {
  email: string
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
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      )
      const token = await userCredential.user.getIdToken()

      setCookie('token', token, {
        maxAge: 60 * 60 * 24,
        secure: true,
        path: '/',
      })

      alert('로그인 성공!')
      router.push('/main')
    } catch (error) {
      console.error(error)
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
            alert('사용자가 없습니다. 회원가입을 진행해 주세요.')
            router.push('/signup')
            break
          case 'auth/wrong-password':
            alert('비밀번호가 틀렸습니다.')
            break
          default:
            alert('알 수 없는 오류가 발생했습니다. 다시 시도해주세요.')
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다. 다시 시도해주세요.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading />
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
            placeholder="이메일"
            {...register('email')}
          />
          {errors.email && (
            <p className="pl-4 text-left text-sm text-red-500">
              {errors.email.message}
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
