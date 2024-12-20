export type Habit = {
  id: string
  name: string
  startDate: string
  endDate: string
  frequency: string[]
  completedDates: string[]
  achievementRate?: number
}
