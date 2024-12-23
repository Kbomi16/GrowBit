'use client'
import { useState, useEffect } from 'react'
import { auth, db } from '@/app/_utils/firebaseConfig'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import UserTabBar from '@/app/_components/TabBar/UserTabBar'
import Profile from '@/app/_components/Profile/Profile'
import Friends from '@/app/_components/Friends/Friends'

type UserData = {
  email: string
  bio: string
  profileImage: string
  nickname: string
  friends?: string[]
  friendsDetails?: { id: string; nickname: string; bio: string }[]
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
  const [activeTab, setActiveTab] = useState<'profile' | 'friends'>('profile')
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

      if (data.friends && data.friends.length > 0) {
        const friendsDetails = await fetchFriendsDetails(data.friends)
        setUserData((prevData) => ({
          ...prevData,
          friendsDetails,
        }))
      }
    }
  }

  // 친구들의 닉네임을 가져오는 함수
  const fetchFriendsDetails = async (friendIds: string[]) => {
    const friendsDetails: { id: string; nickname: string; bio: string }[] = []

    for (const friendId of friendIds) {
      const friendDocRef = doc(db, 'users', friendId)
      const friendDocSnap = await getDoc(friendDocRef)

      if (friendDocSnap.exists()) {
        const friendData = friendDocSnap.data()
        friendsDetails.push({
          id: friendId,
          nickname: friendData.nickname,
          bio: friendData.bio,
        })
      }
    }

    return friendsDetails
  }

  return (
    <div className="mx-auto mt-10 h-screen w-full max-w-[1200px] px-4">
      <div className="flex flex-col rounded-3xl bg-white p-6 shadow-md">
        <UserTabBar activeTab={activeTab} setActiveTab={setActiveTab} />

        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Profile
                userData={userData}
                setUserData={setUserData}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                tempUserData={tempUserData}
                setTempUserData={setTempUserData}
                userUid={user?.uid}
              />
            </motion.div>
          )}
          {activeTab === 'friends' && (
            <motion.div
              key="friends"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Friends userData={userData} setUserData={setUserData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
