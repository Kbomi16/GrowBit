'use client'
import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
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
import { FiUser, FiLogOut, FiEdit2 } from 'react-icons/fi'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import UserTabBar from '@/app/_components/TabBar/UserTabBar'
import AddFriendModal from '@/app/_components/modal/AddFriendModal'

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

        {/* 프로필 정보 */}
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="mb-4 text-2xl font-semibold">
                {`"${userData.nickname}"님의 정보`}
              </h1>

              <div className="mb-6 flex items-center justify-start">
                {userData.profileImage ? (
                  <Image
                    src={userData.profileImage}
                    alt="Profile Image"
                    className="mr-4 h-24 w-24 rounded-full border-2 border-gray-300 object-cover"
                  />
                ) : (
                  <div className="mr-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-200">
                    <FiUser className="h-12 w-12 text-gray-500" />
                  </div>
                )}
                <div>
                  <div className="text-xl font-semibold">
                    {userData.nickname}
                  </div>
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
                <h2 className="text-lg font-semibold">친구 목록</h2>
                <button
                  onClick={() => setShowModal(true)}
                  className="rounded-full bg-green-30 px-6 py-3 text-white shadow-lg transition hover:bg-green-40"
                >
                  친구 추가
                </button>
              </div>
              <p className="text-gray-600">아직 친구가 없습니다.</p>
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
