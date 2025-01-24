import { UserData } from '@/types/userData'
import { Dispatch, SetStateAction, useState } from 'react'
import { db, auth } from '@/app/_libs/firebaseConfig'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from 'firebase/firestore'

type AddFriendModalProps = {
  onClose: () => void
  setUserData: Dispatch<SetStateAction<UserData>>
  userData: UserData
  onAddFriend: (newFriend: {
    id: string
    nickname: string
    bio: string
  }) => void
}

export default function AddFriendModal({
  onClose,
  setUserData,
  userData,
  onAddFriend,
}: AddFriendModalProps) {
  const [friendNickname, setFriendNickname] = useState('')
  const [friendError, setFriendError] = useState('')

  // 친구 추가 후 사용자 데이터 갱신
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

      // 친구 목록에 바로 추가
      const updatedFriends = [...(userData.friends || []), friendId]
      const userDocRef = doc(db, 'users', auth.currentUser?.uid || '')
      await updateDoc(userDocRef, { friends: updatedFriends })

      // 상대방의 친구 목록에도 추가
      const friendDocRef = doc(db, 'users', friendId)
      const friendDocSnapshot = await getDoc(friendDocRef)

      if (!friendDocSnapshot.exists()) {
        setFriendError('친구 정보가 없습니다.')
        return
      }

      const friendData = friendDocSnapshot.data()

      if (!friendData) {
        setFriendError('친구 정보를 불러오는 데 실패했습니다.')
        return
      }

      const updatedFriendList = [
        ...(friendData.friends || []),
        auth.currentUser?.uid || '',
      ]
      await updateDoc(friendDocRef, { friends: updatedFriendList })

      // 새로운 친구의 상세 정보
      const newFriendDetails = {
        id: friendId,
        nickname: friendData.nickname,
        bio: friendData.bio,
      }

      // 부모 컴포넌트에 친구 추가
      onAddFriend(newFriendDetails)

      // 사용자 데이터를 갱신 (state에 바로 반영)
      setUserData((prevData) => ({
        ...prevData,
        friends: updatedFriends, // 친구 목록 갱신
      }))

      alert(`🎉 "${friendNickname}"님과 친구가 되었습니다!`)
      setFriendNickname('')
      setFriendError('')
      onClose()
    } catch (error) {
      console.error('친구 추가 중 오류 발생:', error)
      setFriendError('친구를 추가하는 데 실패했습니다.')
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="mx-auto w-full max-w-xs rounded-lg bg-white p-4 shadow-md md:max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-2xl font-semibold">👤 친구 추가하기</h2>

        <div className="mb-4">
          <label htmlFor="friendNickname" className="mb-2 block text-sm">
            친구 닉네임
          </label>
          <input
            id="friendNickname"
            type="text"
            value={friendNickname}
            onChange={(e) => setFriendNickname(e.target.value)}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 outline-none focus:border-green-40"
            placeholder="닉네임을 입력하세요"
          />
          {friendError && (
            <p className="mt-1 text-sm text-red-500">{friendError}</p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-full border-2 border-green-30 bg-white px-4 py-2 text-black transition hover:bg-green-30 hover:text-white"
          >
            취소
          </button>
          <button
            onClick={handleAddFriend}
            className="rounded-full bg-green-30 px-4 py-2 text-white transition hover:bg-green-40"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  )
}
