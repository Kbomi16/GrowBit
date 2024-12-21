import { useState } from 'react'
import { FaTrash } from 'react-icons/fa'

type FriendListProps = {
  friends: { id: string; nickname: string; bio: string }[]
}

export default function FriendList({ friends }: FriendListProps) {
  const [updatedFriends, setUpdatedFriends] = useState(friends)

  const handleDeleteFriend = (id: string) => {
    setUpdatedFriends((prevFriends) =>
      prevFriends.filter((friend) => friend.id !== id),
    )
  }

  return (
    <div className="mt-4">
      <div className="space-y-4">
        {updatedFriends.length === 0 ? (
          <p className="text-gray-500">
            친구가 없습니다. 친구를 추가해 보세요.
          </p>
        ) : (
          updatedFriends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between rounded-lg bg-gray-100 p-4 shadow-sm"
            >
              <div className="flex flex-col items-center md:flex-row md:gap-4">
                <div className="text-lg font-semibold">{friend.nickname}</div>
                <p className="text-sm md:text-base">{friend.bio}</p>
              </div>
              <button
                onClick={() => handleDeleteFriend(friend.id)}
                className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
              >
                <FaTrash size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
