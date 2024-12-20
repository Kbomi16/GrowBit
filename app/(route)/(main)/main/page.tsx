'use client'
import AddHabitModal from '@/app/_components/modal/AddHabitModal'
import { db } from '@/app/_utils/firebaseConfig'
import {
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
  deleteDoc,
} from 'firebase/firestore'
import { useState, useEffect } from 'react'
import 'react-calendar/dist/Calendar.css'
import '@/public/styles/reactCalendar.css'
import HabitCard from '@/app/_components/habitCard/HabitCard'
import { Habit } from '@/types/habit'
import AchievementRateChart from '@/app/_components/achievementRateChart/AchievementRateChart'
import LowestAchievementHabit from '@/app/_components/achievementRateChart/LowestAchievementHabit'
import { calculateAchievementRate } from '@/app/_utils/calculateAchievementRate'

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
    today.setHours(0, 0, 0, 0)

    return (
      date < today && // 오늘 이전 날짜
      isDateClickable(habit, date) // 클릭 가능한 날짜인지 확인
    )
  }

  const handleDeleteHabit = async (habitId: string) => {
    const confirmDelete = window.confirm('이 루틴을 삭제하시겠습니까?')
    if (confirmDelete) {
      const habitRef = doc(db, 'habits', habitId)
      await deleteDoc(habitRef)
      fetchHabits()
    }
  }

  // 제일 낮은 달성률 계산
  const calculateAchievementRates = () => {
    return habits.map((habit) => {
      const totalDays = habit.frequency.length
      const completedCount = habit.completedDates.length
      const achievementRate = calculateAchievementRate(
        completedCount,
        totalDays,
      )
      return { ...habit, achievementRate }
    })
  }

  const habitWithRates = calculateAchievementRates()
  const lowestHabit =
    habitWithRates.length > 0
      ? habitWithRates.reduce(
          (prev, curr) =>
            prev.achievementRate < curr.achievementRate ? prev : curr,
          habitWithRates[0],
        )
      : null

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div className="p-4">
        <div className="grid w-full grid-cols-2 gap-4">
          <AchievementRateChart habits={habits} />
          <LowestAchievementHabit lowestHabit={lowestHabit} />
        </div>
      </div>
      <div className="p-4">
        <button
          onClick={() => setShowModal(true)}
          className="w-full rounded-full bg-green-30 px-6 py-3 text-white shadow-lg transition hover:bg-green-40"
        >
          루틴 추가
        </button>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onDelete={handleDeleteHabit}
              onDateClick={handleDateClick}
              isDateClickable={isDateClickable}
              isDateCompleted={isDateCompleted}
              isDateMissed={isDateMissed}
            />
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
