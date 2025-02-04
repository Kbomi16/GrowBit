export const calculateAchievementRate = (
  completedCount: number,
  totalDays: number,
): number => {
  return totalDays > 0 ? Math.floor((completedCount / totalDays) * 100) : 0
}
