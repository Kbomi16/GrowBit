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

type Habit = {
  id: string
  name: string
  startDate: string
  endDate: string
  frequency: string[] // 요일 배열 (예: ["Mon", "Wed", "Fri"])
  completedDates: string[] // 완료된 날짜를 배열로 저장
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

  // 완료된 일수와 달성률 계산
  const calculateCompletionRate = (habit: Habit) => {
    const start = new Date(habit.startDate)
    const end = new Date(habit.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    // 완료된 날짜 수 계산
    const completedDays = habit.completedDates.length
    const completionRate = (completedDays / diffDays) * 100
    return {
      completedDays,
      completionRate: completionRate.toFixed(2),
    }
  }

  // 완료 버튼 클릭 처리
  const markAsCompleted = async (habitId: string, date: string) => {
    const habitRef = doc(db, 'habits', habitId)
    await updateDoc(habitRef, {
      completedDates: arrayUnion(date), // 완료된 날짜 추가
    })
    fetchHabits() // 습관 목록 갱신
  }

  const handleDateSelect = (
    value: Date | null,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setSelectedDate(value) // 선택된 날짜 저장
  }

  // 선택된 날짜가 해당 습관의 frequency에 맞는지 확인
  const isDateValidForCompletion = (habit: Habit, date: Date) => {
    const dayOfWeek = date.toLocaleString('en-ko', { weekday: 'short' }) // "Mon", "Tue", etc.
    return habit.frequency.includes(dayOfWeek)
  }

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <div className="p-4">
        <button
          onClick={() => setShowModal(true)}
          className="rounded-full bg-green-30 px-6 py-3 text-white shadow-lg transition hover:bg-green-40"
        >
          습관 추가
        </button>

        <div className="mt-6 w-full md:grid md:grid-cols-2">
          {habits.map((habit) => {
            const { completedDays, completionRate } =
              calculateCompletionRate(habit)

            return (
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
                  완료된 일수: {completedDays}일
                </p>
                <p className="font-semibold text-gray-800">
                  달성률: {completionRate}%
                </p>

                {/* 날짜 선택 캘린더 */}
                <div className="mt-4">
                  <Calendar onChange={handleDateSelect} value={selectedDate} />
                </div>

                <div className="mt-4 grid grid-cols-2 items-center justify-center gap-2 md:grid-cols-7">
                  {selectedDate &&
                    isDateValidForCompletion(habit, selectedDate) && (
                      <button
                        onClick={() =>
                          markAsCompleted(
                            habit.id,
                            selectedDate.toISOString().split('T')[0], // YYYY-MM-DD 형식으로 변환
                          )
                        }
                        className="w-full rounded-full bg-blue-500 px-4 py-2 font-semibold text-white"
                      >
                        완료
                      </button>
                    )}
                </div>
              </div>
            )
          })}
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
