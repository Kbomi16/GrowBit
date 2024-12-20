import { Habit } from '@/types/habit'
import { calculateAchievementRate } from './calculateAchievementRate'

export const calculateAchievementData = (habit: Habit) => {
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

  return { totalDays, achievementRate }
}
