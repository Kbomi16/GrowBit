import { Habit } from '@/types/habit'

type LowestAchievementHabitProps = {
  lowestHabit: Habit | null
}

export default function LowestAchievementHabit({
  lowestHabit,
}: LowestAchievementHabitProps) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-md">
      {lowestHabit ? (
        <div className="text-center">
          <h3 className="text-lg font-semibold">
            최저 달성률 습관 <br /> {lowestHabit.name} (
            {lowestHabit.achievementRate}%)
          </h3>
          <h3 className="text-lg">
            오늘은 {lowestHabit.name}을(를) 더 열심히 해보세요! 💪
          </h3>
        </div>
      ) : (
        <div className="text-center">
          <h3 className="text-lg font-semibold">
            현재 습관이 없습니다. 새로운 습관을 추가해 보세요! ✨
          </h3>
        </div>
      )}
    </div>
  )
}
