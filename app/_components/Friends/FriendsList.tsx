import { FriendData } from '@/types/userData'

type FriendListProps = {
  friends: FriendData[]
  onDeleteFriend: (friendId: string) => void
}

export default function FriendList({
  friends,
  onDeleteFriend,
}: FriendListProps) {
  return (
    <div className="my-4">
      <ul className="space-y-4">
        {friends.map((friend) => (
          <li
            key={friend.id}
            className="flex items-center justify-between rounded-lg bg-gray-100 p-4 shadow-md"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-center md:gap-4">
              <h3 className="text-lg font-semibold">{friend.nickname}</h3>
              <p className="text-sm text-gray-500">{friend.bio}</p>
            </div>
            <button
              onClick={() => onDeleteFriend(friend.id)}
              className="ml-4 flex items-center justify-center rounded-full bg-red-500 px-3 py-2 text-white transition-all hover:bg-red-700"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
