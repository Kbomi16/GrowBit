'use client'
import AddHabitModal from '@/app/_components/modal/AddHabitModal'
import { db } from '@/app/_utils/firebaseConfig'
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore'
import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import '@/public/styles/reactCalendar.css'

type Habit = {
  id: string
  name: string
  startDate: string
  endDate: string
  frequency: string[]
  completedDates: string[]
}

export default function Main() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Firestore에서 습관 불러오기
  const fetchHabits = async () => {
    const habitsCollection = collection(db, 'habits')
    const habitSnapshot = await getDocs(habitsCollection)
    const habitList = habitSnapshot.docs.map((doc) => {
      const habitData = doc.data()
      return {
        id: doc.id,
        name: habitData.name,
        startDate: habitData.startDate,
        endDate: habitData.endDate,
        frequency: habitData.frequency,
        completedDates: habitData.completedDates || [],
      }
    })
    setHabits(habitList)
  }

  useEffect(() => {
    fetchHabits()
  }, [])

  // 완료 버튼 클릭 처리
  const markAsCompleted = async (habitId: string, date: string) => {
    const habitRef = doc(db, 'habits', habitId)
    await updateDoc(habitRef, {
      completedDates: arrayUnion(date),
    })
    fetchHabits()
  }

  // 캘린더 타일 커스텀 스타일 적용
  const tileContent = ({ date }: { date: Date }) => {
    const formattedDate = date.toISOString().split('T')[0]

    // 완료된 날짜 확인
    const isCompleted = habits.some((habit) =>
      habit.completedDates.includes(formattedDate),
    )

    // 비활성화 여부 확인
    const isDisabled = habits.every(
      (habit) => !habit.completedDates.includes(formattedDate),
    )

    return (
      <div
        className={`custom-tile ${isCompleted ? 'completed' : ''} ${isDisabled ? 'disabled' : ''}`}
      >
        {date.getDate()}
      </div>
    )
  }

  // 선택된 날짜가 해당 습관의 수행 요일에 포함되는지 확인
  const isDateValidForHabit = (habit: Habit, date: Date) => {
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' }) // 요일 (예: "Mon", "Tue")
    return habit.frequency.includes(dayOfWeek)
  }

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <div className="p-4">
        <button
          onClick={() => setShowModal(true)}
          className="w-full rounded-full bg-green-40 px-6 py-3 text-white shadow-lg transition hover:bg-green-600"
        >
          루틴 추가
        </button>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {habits.map((habit) => (
            <div key={habit.id} className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-2 text-xl font-semibold text-gray-800">
                {habit.name}
              </h3>
              <p className="text-gray-600">시작 날짜: {habit.startDate}</p>
              <p className="text-gray-600">종료 날짜: {habit.endDate}</p>
              <p className="mb-4 text-gray-600">
                매주 수행 요일: {habit.frequency.join(', ')}
              </p>
              <p className="font-semibold text-gray-800">
                완료된 일수: {habit.completedDates.length}일
              </p>

              {/* 날짜 선택 캘린더 */}
              <div className="mt-4">
                <Calendar
                  onChange={(value) => setSelectedDate(value as Date)}
                  value={selectedDate}
                  tileContent={tileContent}
                  className="custom-calendar rounded-lg border-2 border-gray-300"
                />
              </div>

              {selectedDate &&
                isDateValidForHabit(habit, selectedDate) &&
                !habit.completedDates.includes(
                  selectedDate.toISOString().split('T')[0],
                ) && (
                  <button
                    onClick={() =>
                      markAsCompleted(
                        habit.id,
                        selectedDate.toISOString().split('T')[0],
                      )
                    }
                    className="mt-4 w-full rounded-full bg-green-500 px-6 py-3 text-white shadow-lg transition hover:bg-green-600"
                  >
                    완료
                  </button>
                )}
            </div>
          ))}
        </div>

        {showModal && (
          <AddHabitModal
            onClose={() => setShowModal(false)}
            onAddHabit={fetchHabits}
          />
        )}
      </div>
    </div>
  )
}
