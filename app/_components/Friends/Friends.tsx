import { Dispatch, SetStateAction, useState } from 'react'
import AddFriendModal from '@/app/_components/modal/AddFriendModal'
import FriendList from '@/app/_components/FriendList/FriendList'
import { UserData } from '@/types/userData'
import { db, auth } from '@/app/_utils/firebaseConfig'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore'

type FriendsProps = {
  userData: UserData
  setUserData: Dispatch<SetStateAction<UserData>>
}

export default function Friends({ userData, setUserData }: FriendsProps) {
  const [showModal, setShowModal] = useState(false)
  const [friendNickname, setFriendNickname] = useState('')
  const [friendError, setFriendError] = useState('')

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

      if (auth.currentUser?.uid === friendId) {
        setFriendError('자신을 친구로 추가할 수 없습니다.')
        return
      }

      if (userData.friends?.includes(friendId)) {
        setFriendError('이미 친구로 등록된 사용자입니다.')
        return
      }

      const updatedFriends = [...(userData.friends || []), friendId]
      const userDocRef = doc(db, 'users', auth.currentUser?.uid || '')
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
    <div>
      <div className="flex items-start justify-between">
        <h2 className="mb-4 text-2xl font-semibold">친구 목록</h2>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-full bg-green-30 px-6 py-3 text-white shadow-lg transition hover:bg-green-40"
        >
          친구 추가
        </button>
        <FriendList friends={userData.friendsDetails || []} />
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
