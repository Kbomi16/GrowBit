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
    labels: ['완료', '미완료'],
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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
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
    <div className="flex flex-col items-center rounded-3xl bg-white p-4 shadow-md">
      <h2 className="text-base font-semibold md:text-xl">
        🎉 당신의 총 달성률은 {totalCompletionRate}%입니다! 잘하고 있어요! 🌟
      </h2>
      <div className="size-32 md:size-64">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  )
}
