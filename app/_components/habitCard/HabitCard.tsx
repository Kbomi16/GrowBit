import { Habit } from '@/types/habit'
import Calendar from 'react-calendar'
import { FiTrash } from 'react-icons/fi'
import HabitCardChart from './HabitCardChart'
import { calculateAchievementRate } from '@/app/_utils/calculateAchievementRate'

type HabitCardProps = {
  habit: Habit
  onDelete: (id: string) => Promise<void>
  onDateClick: (habitId: string, date: Date) => Promise<void>
  isDateClickable: (habit: Habit, date: Date) => boolean
  isDateCompleted: (habit: Habit, date: Date) => boolean
  isDateMissed: (habit: Habit, date: Date) => boolean
}

export default function HabitCard({
  habit,
  onDelete,
  onDateClick,
  isDateClickable,
  isDateCompleted,
  isDateMissed,
}: HabitCardProps) {
  const startDate = new Date(habit.startDate)
  const endDate = new Date(habit.endDate)

  // frequency에 해당하는 요일을 계산
  const frequencySet = new Set(habit.frequency.map((day) => day.toLowerCase())) // 요일을 소문자로 변환하여 Set 생성

  // 총 수행 일수 계산 (frequency에 해당하는 요일만)
  let totalDays = 0
  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const dayOfWeek = date
      .toLocaleString('default', { weekday: 'short' })
      .toLowerCase() // 요일을 소문자로 가져오기
    if (frequencySet.has(dayOfWeek)) {
      totalDays++
    }
  }

  // 완료된 날짜 수 계산
  const completedCount = habit.completedDates.length

  // 달성률 계산
  const achievementRate = calculateAchievementRate(completedCount, totalDays)

  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <div className="flex justify-between">
        <h3 className="mb-2 text-xl font-semibold text-gray-800">
          {habit.name}
        </h3>
        <button
          onClick={() => onDelete(habit.id)}
          className="text-red-500"
          aria-label="루틴 삭제 버튼"
        >
          <FiTrash size={20} />
        </button>
      </div>
      <div className="grid grid-cols-2">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-gray-600 md:text-base">
            📆시작 날짜: <span className="block md:inline"></span>
            {habit.startDate}
          </p>
          <p className="text-sm text-gray-600 md:text-base">
            📆종료 날짜: <span className="block md:inline"></span>
            {habit.endDate}
          </p>
          <p className="text-sm text-gray-600 md:text-base">
            🏃🏻‍➡️매주 수행 요일: <span className="block md:inline"></span>
            {habit.frequency.join(', ')}
          </p>
          <p className="mt-4 text-sm font-semibold text-gray-800 md:text-lg">
            🔥달성률: {achievementRate}%
          </p>
        </div>
        <div className="flex justify-center">
          <HabitCardChart
            completedCount={completedCount}
            totalCount={totalDays}
          />
        </div>
      </div>
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
            if (isDateClickable(habit, date) && !isDateMissed(habit, date)) {
              onDateClick(habit.id, date)
            }
          }}
        />
      </div>
    </div>
  )
}
