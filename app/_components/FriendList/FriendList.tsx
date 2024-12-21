type FriendListProps = {
  friends: { id: string; nickname: string }[]
}
export default function FriendList({ friends }: FriendListProps) {
  return (
    <div className="mt-4">
      <div className="space-y-4">
        {friends.length === 0 ? (
          <p className="text-gray-500">
            친구가 없습니다. 친구를 추가해 보세요.
          </p>
        ) : (
          friends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between rounded-lg bg-gray-100 p-4 shadow-sm"
            >
              <div className="text-lg font-semibold">{friend.nickname}</div>
              <button className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600">
                삭제
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
