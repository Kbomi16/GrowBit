'use client'
import { useState, useEffect } from 'react'
import { auth, db } from '@/app/_libs/firebaseConfig'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import UserTabBar from '@/app/_components/TabBar/UserTabBar'
import Profile from '@/app/_components/Profile/Profile'
import { UserData } from '@/types/userData'
import Friends from '@/app/_components/Friends/Friends'

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData>({
    id: '',
    email: '',
    bio: '',
    profileImage: '',
    nickname: '',
    friends: [],
  })
  const [activeTab, setActiveTab] = useState<'profile' | 'friends'>('profile')

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
    }
  }

  return (
    <div className="mx-auto mt-10 h-screen w-full max-w-[1000px] px-4">
      <div className="rounded-3xl bg-white p-6 shadow-md">
        <UserTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'profile' ? (
          <Profile userData={userData} setUserData={setUserData} user={user} />
        ) : (
          <Friends userData={userData} setUserData={setUserData} />
        )}
      </div>
    </div>
  )
}
