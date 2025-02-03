import { auth, db } from '@/app/_libs/firebaseConfig'
import { addDoc, collection, doc, getDoc } from 'firebase/firestore'
import { ChangeEvent, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import '@/public/styles/reactDatePicker.css'
import { FriendData, UserData } from '@/types/userData'
import DayCheckbox from '../dayCheckbox/DayCheckbox'
import { FiCheck, FiUser } from 'react-icons/fi'

type HabitModalProps = {
  onClose: () => void
  onAddHabit: () => void
}

type Habit = {
  name: string
  startDate: string
  endDate: string
  frequency: string[]
  completedDates: string[]
  userId: string
  friends: string[]
  progress: Record<string, number>
}

export default function AddHabitModal({
  onClose,
  onAddHabit,
}: HabitModalProps) {
  const [habitName, setHabitName] = useState('')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [frequency, setFrequency] = useState<string[]>([])
  const [currentUser, setCurrentUser] = useState<UserData | null>(null)
  const [friends, setFriends] = useState<FriendData[]>([])
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const today = new Date()

  useEffect(() => {
    const getCurrentUser = async () => {
      const user = auth.currentUser
      if (user) {
        const userData = await fetchUserData(user.uid)
        setCurrentUser(userData)
        if (userData) {
          fetchFriends(userData)
        }
      }
    }
    getCurrentUser()
  }, [])

  const fetchUserData = async (userId: string) => {
    const userDocRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userDocRef)
    return userDoc.exists() ? (userDoc.data() as UserData) : null
  }

  const fetchFriends = async (userData: UserData) => {
    const friendsIds = userData.friends || []
    const friendsDetails: FriendData[] = []

    for (const friendId of friendsIds) {
      const friendDocRef = doc(db, 'users', friendId)
      const friendDoc = await getDoc(friendDocRef)

      if (friendDoc.exists()) {
        friendsDetails.push({
          id: friendId,
          nickname: friendDoc.data()?.nickname || '',
          bio: friendDoc.data()?.bio || '',
        })
      }
    }
    setFriends(friendsDetails)
  }

  const handleFrequencyChange = (e: ChangeEvent<HTMLInputElement>) => {
    const day = e.target.value
    setFrequency((prev) =>
      e.target.checked ? [...prev, day] : prev.filter((item) => item !== day),
    )
  }

  const handleFriendChange = (
    e: ChangeEvent<HTMLInputElement>,
    friendId: string,
  ) => {
    setSelectedFriends((prev) =>
      e.target.checked
        ? [...prev, friendId]
        : prev.filter((id) => id !== friendId),
    )
  }

  const handleSubmit = async () => {
    if (!habitName.trim()) return alert('루틴 이름을 입력해주세요.')
    if (!startDate || !endDate) return alert('시작일과 종료일을 선택해주세요.')
    if (frequency.length === 0)
      return alert('요일을 최소 1개 이상 선택해주세요.')
    if (endDate.getTime() - startDate.getTime() < 7 * 24 * 60 * 60 * 1000)
      return alert('루틴은 최소 1주일 이상이어야 합니다.')
    if (!currentUser) return alert('로그인이 필요합니다.')

    const newHabit: Habit = {
      name: habitName,
      startDate: startDate?.toISOString().split('T')[0] || '',
      endDate: endDate?.toISOString().split('T')[0] || '',
      frequency,
      completedDates: [],
      userId: currentUser.id,
      friends: selectedFriends,
      progress: selectedFriends.reduce(
        (acc, friendId) => {
          acc[friendId] = 0
          return acc
        },
        {} as Record<string, number>,
      ),
    }

    try {
      await addDoc(collection(db, 'habits'), newHabit)
      onAddHabit()
      alert('루틴 등록 완료!')
      onClose()
    } catch (e) {
      console.error('루틴 추가 실패: ', e)
      alert('오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="mx-auto max-w-xs rounded-lg bg-white p-4 shadow-md md:max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-2xl font-semibold">🔥루틴 등록하기</h2>

        <div className="mb-4">
          <label className="mb-2 block text-sm">루틴 이름</label>
          <input
            type="text"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            placeholder="등록할 루틴명을 입력하세요"
            className="w-full rounded-full border-2 border-gray-300 px-4 py-2 outline-none focus:border-green-40"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 flex items-center text-sm">시작 날짜</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            minDate={today}
            className="w-full cursor-pointer rounded-full border-2 border-gray-300 px-4 py-2 outline-none focus:border-green-40"
            dateFormat="yyyy-MM-dd"
            placeholderText="날짜를 선택해주세요"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 flex items-center text-sm">종료 날짜</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            minDate={startDate || today}
            className="w-full cursor-pointer rounded-full border-2 border-gray-300 px-4 py-2 outline-none focus:border-green-40"
            dateFormat="yyyy-MM-dd"
            placeholderText="날짜를 선택해주세요"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm">매주 수행할 요일</label>
          <div className="flex flex-wrap gap-4">
            {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
              <DayCheckbox
                key={day}
                day={day}
                isSelected={frequency.includes(day)}
                onChange={handleFrequencyChange}
              />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm">친구와 함께하기</label>
          <div className="flex flex-wrap gap-4">
            {friends.map((friend) => (
              <label
                key={friend.id}
                className="flex cursor-pointer items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={selectedFriends.includes(friend.id)}
                  onChange={(e) => handleFriendChange(e, friend.id)}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-3 rounded-full transition">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-200">
                    {selectedFriends.includes(friend.id) ? (
                      <FiCheck className="h-8 w-8 text-gray-500" />
                    ) : (
                      <FiUser className="h-8 w-8 text-gray-500" />
                    )}
                  </div>
                  <span className="text-sm">{friend.nickname}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            className="rounded-full border-2 border-green-40 px-4 py-2 text-black transition-all hover:bg-green-40 hover:text-white"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="rounded-full bg-green-40 px-4 py-2 text-white transition-all hover:bg-green-50"
            onClick={handleSubmit}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  )
}
