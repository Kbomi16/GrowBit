'use client'
import AddHabitModal from '@/app/_components/modal/AddHabitModal'
import { db } from '@/app/_utils/firebaseConfig'
import {
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
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

  const handleDateClick = async (habitId: string, date: Date) => {
    const dateString = date.toISOString().split('T')[0] // YYYY-MM-DD 형식
    const habit = habits.find((h) => h.id === habitId)

    if (habit && !habit.completedDates.includes(dateString)) {
      const confirmCompletion = window.confirm(
        `${habit.name}을(를) 완료하시겠습니까?`,
      )
      if (confirmCompletion) {
        const habitRef = doc(db, 'habits', habitId)
        await updateDoc(habitRef, {
          completedDates: arrayUnion(dateString),
        })
        fetchHabits()
      }
    }
  }

  // 주어진 날짜(date)가 특정 습관(habit)에 대해 클릭 가능한 날짜인지 확인
  const isDateClickable = (habit: Habit, date: Date) => {
    const dayOfWeek = date.getDay()
    const frequencyDays = habit.frequency.map((day) =>
      ['일', '월', '화', '수', '목', '금', '토'].indexOf(day),
    )

    return (
      frequencyDays.includes(dayOfWeek) &&
      date >= new Date(habit.startDate) &&
      date <= new Date(habit.endDate)
    )
  }

  const isDateCompleted = (habit: Habit, date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return habit.completedDates.includes(dateString)
  }

  const isDateMissed = (habit: Habit, date: Date) => {
    const today = new Date()
    return (
      date < today && // 오늘 이전 날짜
      isDateClickable(habit, date) // 클릭 가능한 날짜인지 확인
    )
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
                  tileClassName={({ date }) => {
                    if (isDateCompleted(habit, date)) {
                      return 'completed'
                    } else if (isDateMissed(habit, date)) {
                      return 'missed'
                    } else if (isDateClickable(habit, date)) {
                      return 'clickable'
                    } else {
                      return 'not-clickable'
                    }
                  }}
                  onClickDay={(date) => {
                    if (
                      isDateClickable(habit, date) &&
                      !isDateMissed(habit, date)
                    ) {
                      handleDateClick(habit.id, date)
                    }
                  }}
                />
              </div>
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
