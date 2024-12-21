type AddFriendModalProps = {
  onClose: () => void
  onAddFriend: () => void
  friendNickname: string
  setFriendNickname: (nickname: string) => void
  friendError: string
}

export default function AddFriendModal({
  onClose,
  onAddFriend,
  friendNickname,
  setFriendNickname,
  friendError,
}: AddFriendModalProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="mx-auto w-full max-w-xs rounded-lg bg-white p-4 shadow-md md:max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-2xl font-semibold">👤친구 추가하기</h2>

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
            onClick={onAddFriend}
            className="rounded-full bg-green-30 px-4 py-2 text-white transition hover:bg-green-40"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  )
}
