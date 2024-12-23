'use client'
import AddHabitModal from '@/app/_components/modal/AddHabitModal'
import { auth, db } from '@/app/_utils/firebaseConfig'
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
import TabBar from '@/app/_components/TabBar/TabBar'
import Pagination from '@/app/_components/Pagination/Pagination'
import { calculateAchievementData } from '@/app/_utils/calculateAchievementData'

export default function Main() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [showModal, setShowModal] = useState(false)

  const [activeTab, setActiveTab] = useState<
    'all' | 'completed' | 'incomplete'
  >('incomplete')

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  const fetchHabits = async () => {
    const currentUserId = auth.currentUser?.uid // 현재 로그인한 유저의 ID 가져오기
    if (!currentUserId) return // 유저가 없으면 아무것도 하지 않음

    const habitsCollection = collection(db, 'habits')
    const habitSnapshot = await getDocs(habitsCollection)
    const habitList = habitSnapshot.docs
      .map((doc) => {
        const habitData = doc.data()
        return {
          id: doc.id,
          name: habitData.name,
          startDate: habitData.startDate,
          endDate: habitData.endDate,
          frequency: habitData.frequency,
          completedDates: habitData.completedDates || [],
          userId: habitData.userId,
        }
      })
      .filter((habit) => habit.userId === currentUserId) // 유저 ID 필터링
    setHabits(habitList) // 해당 유저의 루틴만 설정
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
      const { achievementRate } = calculateAchievementData(habit)
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

  const handleTabChange = (tab: 'all' | 'completed' | 'incomplete') => {
    setActiveTab(tab)
    setCurrentPage(1) // 탭 변경 시 페이지를 1로 리셋
  }

  const filteredHabits = habits.filter((habit) => {
    const { achievementRate } = calculateAchievementData(habit)

    const isExpired = new Date(habit.endDate) < new Date()

    if (activeTab === 'completed') {
      return achievementRate === 100 || isExpired
    }
    if (activeTab === 'incomplete') {
      return achievementRate < 100 && !isExpired
    }
    return true // 'all'일 경우, 모든 습관 표시
  })

  const totalPages = Math.ceil(filteredHabits.length / itemsPerPage)
  const displayedHabits = filteredHabits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div className="p-4">
        <div className="grid w-full grid-cols-2 gap-4">
          <AchievementRateChart habits={habits} />
          <LowestAchievementHabit lowestHabit={lowestHabit} />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
          <button
            onClick={() => setShowModal(true)}
            className="rounded-full bg-green-30 px-6 py-3 text-white shadow-lg transition hover:bg-green-40"
          >
            루틴 추가
          </button>
        </div>
        <div className="mt-6">
          {habits.length === 0 ? (
            <div className="h-screen text-center text-gray-500">
              <p>현재 루틴이 없습니다.</p>
              <p>새로운 루틴을 추가해보세요!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {displayedHabits.map((habit) => (
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
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
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
