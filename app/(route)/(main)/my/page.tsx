'use client'
import { useState, useEffect } from 'react'
import { auth, db } from '@/app/_utils/firebaseConfig'
import { onAuthStateChanged, User } from 'firebase/auth'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import UserTabBar from '@/app/_components/TabBar/UserTabBar'
import AddFriendModal from '@/app/_components/modal/AddFriendModal'
import FriendList from '@/app/_components/FriendList/FriendList'
import Profile from '@/app/_components/Profile/Profile'

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

  const [showModal, setShowModal] = useState(false)
  const [friendNickname, setFriendNickname] = useState('')
  const [friendError, setFriendError] = useState('')

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

  // 친구 추가 로직
  const handleAddFriend = async () => {
    if (!friendNickname.trim()) {
      setFriendError('닉네임을 입력하세요.')
      return
    }

    try {
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('nickname', '==', friendNickname))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        setFriendError('해당 닉네임의 사용자를 찾을 수 없습니다.')
        return
      }

      const friendDoc = querySnapshot.docs[0]
      const friendId = friendDoc.id

      if (user?.uid === friendId) {
        setFriendError('자신을 친구로 추가할 수 없습니다.')
        return
      }

      if (userData.friends?.includes(friendId)) {
        setFriendError('이미 친구로 등록된 사용자입니다.')
        return
      }

      const updatedFriends = [...(userData.friends || []), friendId]
      const userDocRef = doc(db, 'users', user?.uid || '')
      await updateDoc(userDocRef, { friends: updatedFriends })

      setUserData((prev) => ({
        ...prev,
        friends: updatedFriends,
      }))
      alert(
        `🎉 친구 추가에 성공했습니다! "${friendNickname}"님과 친구가 되었어요!`,
      )
      setShowModal(false)
      setFriendNickname('')
      setFriendError('')
    } catch (error) {
      console.error('친구 추가 중 오류 발생:', error)
      setFriendError('친구를 추가하는 데 실패했습니다.')
    }
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
              <div className="flex items-start justify-between">
                <h2 className="mb-4 text-2xl font-semibold">친구 목록</h2>
                <button
                  onClick={() => setShowModal(true)}
                  className="rounded-full bg-green-30 px-6 py-3 text-white shadow-lg transition hover:bg-green-40"
                >
                  친구 추가
                </button>
              </div>
              <FriendList friends={userData.friendsDetails || []} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {showModal && (
        <AddFriendModal
          onClose={() => setShowModal(false)}
          onAddFriend={handleAddFriend}
          friendNickname={friendNickname}
          setFriendNickname={setFriendNickname}
          friendError={friendError}
        />
      )}
    </div>
  )
}
