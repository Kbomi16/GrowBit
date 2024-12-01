import { db } from '@/app/_utils/firebaseConfig'
import { addDoc, collection } from 'firebase/firestore'
import { ChangeEvent, useState } from 'react'

type HabitModalProps = {
  onClose: () => void
  onAddHabit: () => void
}

type Habit = {
  name: string
  startDate: string
  endDate: string
  frequency: string[]
}

export default function AddHabitModal({
  onClose,
  onAddHabit,
}: HabitModalProps) {
  const [habitName, setHabitName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [frequency, setFrequency] = useState<string[]>([])

  // 요일 선택
  const handleFrequencyChange = (e: ChangeEvent<HTMLInputElement>) => {
    const day = e.target.value
    if (e.target.checked) {
      setFrequency((prev) => [...prev, day])
    } else {
      setFrequency((prev) => prev.filter((item) => item !== day))
    }
  }

  const handleSubmit = async () => {
    const newHabit: Habit = {
      name: habitName,
      startDate,
      endDate,
      frequency,
    }

    try {
      await addDoc(collection(db, 'habits'), newHabit)
      onAddHabit()
      alert('습관 등록 완료!')
      onClose()
    } catch (e) {
      console.error('습관 추가 실패: ', e)
      alert('오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="mx-auto max-w-xl rounded-lg bg-white p-4 shadow-md"
        onClick={(e) => e.stopPropagation()}
        // 버튼을 클릭할 경우
        // 클릭 이벤트가 부모 요소인 모달 배경으로 전파되어 모달이 즉시 닫힐 수 있음 방지
      >
        <h2 className="mb-6 text-2xl font-semibold">습관 설정</h2>

        <div className="mb-4">
          <label className="mb-2 block text-sm">습관 이름</label>
          <input
            type="text"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            placeholder="습관을 입력하세요"
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm">시작 날짜</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm">종료 날짜</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm">매주 수행할 요일</label>
          <div className="flex gap-4">
            {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
              <label key={day} className="flex items-center">
                <input
                  type="checkbox"
                  value={day}
                  checked={frequency.includes(day)}
                  onChange={handleFrequencyChange}
                  className="mr-2"
                />
                {day}
              </label>
            ))}
          </div>
        </div>

        <button
          className="w-full rounded-full bg-green-30 px-6 py-3 text-white shadow-lg transition hover:bg-green-40"
          onClick={handleSubmit}
        >
          습관 추가
        </button>
      </div>
    </div>
  )
}
