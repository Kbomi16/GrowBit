'use client'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Habit } from '@/types/habit'

ChartJS.register(ArcElement, Tooltip, Legend)

type AchievementChartProps = {
  habits: Habit[]
}

export default function AchievementRateChart({
  habits,
}: AchievementChartProps) {
  const totalHabits = habits.length
  const completedHabits = habits.filter(
    (habit) => habit.completedDates.length > 0,
  ).length
  const totalCompletionRate =
    totalHabits > 0 ? Math.floor((completedHabits / totalHabits) * 100) : 0

  const data = {
    labels: ['완료된 습관', '미완료 습관'],
    datasets: [
      {
        label: '전체 달성률',
        data: [completedHabits, totalHabits - completedHabits],
        backgroundColor: ['#1E4A19', '#edecdf'],
        borderWidth: 1,
        borderRadius: 13,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 5,
        },
      },

      title: {
        display: true,
        text: '전체 달성률',
      },
    },
  }

  return (
    <div>
      <h2 className="text-xl font-semibold">
        🎉 당신의 총 달성률은 {totalCompletionRate}%입니다! 잘하고 있어요! 🌟
      </h2>
      <div className="size-56">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  )
}
