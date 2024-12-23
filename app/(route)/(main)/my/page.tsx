'use client'
import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { auth, db } from '@/app/_utils/firebaseConfig'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { FiUser, FiLogOut, FiEdit2 } from 'react-icons/fi'
import Image from 'next/image'

type UserData = {
  email: string
  bio: string
  profileImage: string
  nickname: string
  friends?: string[]
}

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData>({
    email: '',
    bio: '',
    profileImage: '',
    nickname: '',
    friends: [],
  })
  const [isEditing, setIsEditing] = useState(false)
  const [tempUserData, setTempUserData] = useState<UserData>(userData)

  const router = useRouter()

  // 사용자 인증 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        fetchUserData(user.uid)
      } else {
        router.push('/login')
      }
    })

    return () => unsubscribe()
  }, [router])

  // Firestore에서 사용자 데이터 가져오기
  const fetchUserData = async (uid: string) => {
    const userDocRef = doc(db, 'users', uid)
    const docSnap = await getDoc(userDocRef)

    if (docSnap.exists()) {
      const data = docSnap.data() as UserData
      setUserData(data)
      setTempUserData(data)
    }
  }

  // 사용자 정보 업데이트
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault()
    if (!user?.uid) return

    const userDocRef = doc(db, 'users', user.uid)
    await updateDoc(userDocRef, tempUserData)
    setUserData(tempUserData)
    setIsEditing(false)
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setTempUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleCancel = () => {
    setTempUserData(userData)
    setIsEditing(false)
  }

  const handleLogout = async () => {
    await auth.signOut()
    router.push('/login')
  }

  return (
    <div className="mx-auto mt-10 h-screen w-full max-w-[1000px] px-4">
      <div className="flex flex-col rounded-3xl bg-white p-6 shadow-md lg:flex-row">
        <div className="mb-6 flex items-center justify-center lg:mb-0 lg:w-1/3">
          {userData.profileImage ? (
            <Image
              src={userData.profileImage}
              alt="Profile Image"
              className="mr-4 h-24 w-24 rounded-full border-2 border-gray-300 object-cover md:h-48 md:w-48"
            />
          ) : (
            <div className="mr-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-200 md:h-48 md:w-48">
              <FiUser className="h-12 w-12 text-gray-500 md:h-24 md:w-24" />
            </div>
          )}
        </div>

        <div className="ml-4 lg:w-2/3">
          <h1 className="mb-4 flex items-center text-2xl font-semibold">
            <FiUser className="mr-2" /> {`"${userData.nickname}"님의 정보`}
          </h1>
          <div className="mb-6 flex items-center justify-start">
            <div>
              <div className="text-xl font-semibold">{userData.nickname}</div>
              <div className="text-gray-500">{userData.email}</div>
            </div>
          </div>
          <div className="mb-2">
            <div className="text-lg font-semibold">✍🏻한 줄 소개</div>
            {isEditing ? (
              <input
                name="bio"
                value={tempUserData.bio || ''}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border-2 border-gray-300 p-2 focus:border-green-30 focus:outline-none"
                placeholder="자기소개를 입력하세요"
              />
            ) : (
              <p className="mt-2 text-gray-600">
                {userData.bio || '소개가 없습니다'}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleUpdate}
                    className="rounded-full bg-green-30 px-4 py-2 text-white transition hover:bg-green-40"
                  >
                    저장
                  </button>
                  <button
                    onClick={handleCancel}
                    className="rounded-full border-2 border-green-30 bg-white px-4 py-2 text-black transition hover:bg-green-30 hover:text-white"
                  >
                    취소
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-full bg-green-30 px-4 py-2 text-white transition hover:bg-green-40"
                >
                  <FiEdit2 className="inline" /> 프로필 편집
                </button>
              )}
            </div>
            <hr />
            <button
              onClick={handleLogout}
              className="flex items-center rounded-full border-2 border-slate-100 p-2 px-4 text-gray-600 transition hover:bg-slate-100"
            >
              <FiLogOut className="mr-2 text-gray-600" /> 로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
