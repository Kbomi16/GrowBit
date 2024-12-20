import { Habit } from '@/types/habit'
import Calendar from 'react-calendar'
import { FiTrash } from 'react-icons/fi'
import HabitCardChart from './HabitCardChart'
import { calculateAchievementData } from '@/app/_utils/calculateAchievementData'

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
  const { totalDays, achievementRate } = calculateAchievementData(habit)

  const endDate = new Date(habit.endDate)
  const isCompleted = achievementRate === 100 || endDate < new Date()
  const isExpired = endDate < new Date()

  return (
    <div className="relative rounded-3xl bg-white p-6 shadow-md">
      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-gray-900 bg-opacity-50">
          {isExpired ? (
            <p className="font-semibold text-white md:text-3xl">
              날짜가 지났어요 🥲
            </p>
          ) : (
            <p className="font-semibold text-white md:text-3xl">
              100% 달성했어요 😀
            </p>
          )}
        </div>
      )}
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
            completedCount={habit.completedDates.length}
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
