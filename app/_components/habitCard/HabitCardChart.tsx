'use client'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

type HabitCardChartProps = {
  completedCount: number
  totalCount: number
}

export default function HabitCardChart({
  completedCount,
  totalCount,
}: HabitCardChartProps) {
  const data = {
    labels: ['완료', '미완료'],
    datasets: [
      {
        label: '달성률',
        data: [completedCount, totalCount - completedCount],
        backgroundColor: ['#1E4A19', '#edecdf'],
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 5,
        },
      },
      title: {
        display: true,
        text: '달성률',
      },
    },
  }

  return (
    <div className="size-40">
      <Doughnut data={data} options={options} />
    </div>
  )
}
