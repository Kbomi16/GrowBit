import { db } from '@/app/_utils/firebaseConfig'
import { addDoc, collection } from 'firebase/firestore'
import { ChangeEvent, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import '@/public/styles/reactDatePicker.css'

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
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [frequency, setFrequency] = useState<string[]>([])

  const today = new Date()

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
      startDate: startDate?.toISOString().split('T')[0] || '',
      endDate: endDate?.toISOString().split('T')[0] || '',
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
            minDate={today} // 오늘 날짜 이후로 설정
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
            minDate={startDate || today} // 시작 날짜 이후로 설정
            className="w-full cursor-pointer rounded-full border-2 border-gray-300 px-4 py-2 outline-none focus:border-green-40"
            dateFormat="yyyy-MM-dd"
            placeholderText="날짜를 선택해주세요"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm">매주 수행할 요일</label>
          <div className="flex gap-4">
            {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
              <label key={day} className="flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  value={day}
                  checked={frequency.includes(day)}
                  onChange={handleFrequencyChange}
                  className="hidden"
                />
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    frequency.includes(day)
                      ? 'border-green-20 bg-green-20'
                      : 'border-gray-300'
                  }`}
                >
                  <span
                    className={`text-lg ${frequency.includes(day) ? 'text-white' : 'text-black'}`}
                  >
                    {day}
                  </span>
                </div>
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
