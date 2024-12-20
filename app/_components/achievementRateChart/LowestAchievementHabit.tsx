import { Habit } from '@/types/habit'

type LowestAchievementHabitProps = {
  lowestHabit: Habit | null
}

export default function LowestAchievementHabit({
  lowestHabit,
}: LowestAchievementHabitProps) {
  return (
    <div className="flex h-full items-center justify-center rounded-3xl bg-gradient-to-bl from-blue-100 via-pink-100 to-green-10 p-6 shadow-lg">
      {lowestHabit ? (
        <div className="text-center">
          <h3 className="text-xl font-semibold text-green-40">
            🎯 최저 달성률 루틴
          </h3>
          <p className="mt-2 text-lg font-semibold text-gray-800">
            {lowestHabit.name} ({lowestHabit.achievementRate}%)
          </p>
          <p className="text-md mt-8 text-gray-700">
            오늘은{' '}
            <span className="font-semibold text-blue-500">
              {lowestHabit.name}{' '}
            </span>
            루틴을 더 열심히 해보세요! 💪
          </p>
        </div>
      ) : (
        <div className="text-center">
          <h3 className="font-bold text-xl text-purple-600">
            🌟 새로운 습관 추가
          </h3>
          <p className="text-md mt-4 text-gray-700">
            현재 습관이 없습니다. 새로운 습관을 추가해 보세요! ✨
          </p>
        </div>
      )}
    </div>
  )
}
