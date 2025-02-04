import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FriendData, UserData } from '@/types/userData'
import AddFriendModal from '../modal/AddFriendModal'
import FriendList from './FriendsList'
import { db } from '@/app/_libs/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'

type FriendsProps = {
  userData: UserData
  setUserData: Dispatch<SetStateAction<UserData>>
}

export default function Friends({ userData, setUserData }: FriendsProps) {
  const [showModal, setShowModal] = useState(false)
  const [friends, setFriends] = useState<FriendData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true)
      try {
        const friendsIds = userData.friends || [] // userData에 저장된 친구 ID 목록
        if (friendsIds.length === 0) {
          setLoading(false)
          return
        }

        const friendsDetails: FriendData[] = []

        // friendsIds 목록을 통해 각 친구의 정보 가져오기
        for (const friendId of friendsIds) {
          const friendDocRef = doc(db, 'users', friendId)
          const friendDoc = await getDoc(friendDocRef)

          if (friendDoc.exists()) {
            const friendData = friendDoc.data()
            friendsDetails.push({
              id: friendId,
              nickname: friendData.nickname,
              bio: friendData.bio || '',
            })
          }
        }

        setFriends(friendsDetails)
      } catch (error) {
        console.error('Error fetching friends: ', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFriends()
  }, [userData.friends])

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  // 친구 추가 후 호출할 함수
  const handleAddFriend = (newFriend: {
    id: string
    nickname: string
    bio: string
  }) => {
    setUserData((prevData) => ({
      ...prevData,
      friends: [...(prevData.friends || []), newFriend.id], // 친구 ID를 추가
    }))
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <h2 className="mb-4 text-2xl font-semibold">친구 목록</h2>
        <button
          onClick={handleOpenModal}
          className="rounded-full bg-green-30 px-6 py-3 text-white shadow-lg transition hover:bg-green-40"
        >
          친구 추가
        </button>
      </div>
      {loading ? (
        <p>로딩중...</p>
      ) : friends.length === 0 ? (
        <p>친구가 없습니다.</p>
      ) : (
        <FriendList friends={friends} />
      )}

      {showModal && (
        <AddFriendModal
          onClose={handleCloseModal}
          setUserData={setUserData}
          userData={userData}
          onAddFriend={handleAddFriend}
        />
      )}
    </div>
  )
}
