import { Dispatch, SetStateAction, useState } from 'react'
import FriendList from '@/app/_components/FriendList/FriendList'
import { UserData } from '@/types/userData'
import AddFriendModal from '../modal/AddFriendModal'

type FriendsProps = {
  userData: UserData
  setUserData: Dispatch<SetStateAction<UserData>>
}

export default function Friends({ userData, setUserData }: FriendsProps) {
  const [showModal, setShowModal] = useState(false)

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <h2 className="mb-4 text-2xl font-semibold">친구 목록</h2>
        <button
          onClick={() => handleOpenModal()}
          className="rounded-full bg-green-30 px-6 py-3 text-white shadow-lg transition hover:bg-green-40"
        >
          친구 추가
        </button>
      </div>
      <FriendList friends={userData.friendsDetails || []} />
      {showModal && (
        <AddFriendModal
          onClose={handleCloseModal}
          setUserData={setUserData}
          userData={userData}
        />
      )}
    </div>
  )
}
