import { Habit } from '@/types/habit'
import Calendar from 'react-calendar'
import { FiTrash } from 'react-icons/fi'

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
  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
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
            if (isDateClickable(habit, date) && !isDateMissed(habit, date)) {
              onDateClick(habit.id, date)
            }
          }}
        />
      </div>
    </div>
  )
}
