import { ChangeEvent } from 'react'

type DayCheckboxProps = {
  day: string
  isSelected: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function DayCheckbox({
  day,
  isSelected,
  onChange,
}: DayCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center">
      <input
        type="checkbox"
        value={day}
        checked={isSelected}
        onChange={onChange}
        className="hidden"
      />
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 md:h-10 md:w-10 ${
          isSelected ? 'border-green-20 bg-green-20' : 'border-gray-300'
        }`}
      >
        <span
          className={`text-sm md:text-lg ${
            isSelected ? 'text-white' : 'text-black'
          }`}
        >
          {day}
        </span>
      </div>
    </label>
  )
}
