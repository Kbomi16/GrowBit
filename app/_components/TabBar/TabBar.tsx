type TabBarProps = {
  activeTab: 'all' | 'completed' | 'incomplete'
  onTabChange: (tab: 'all' | 'completed' | 'incomplete') => void
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="mb-4 flex justify-around border-b border-gray-300">
      <button
        onClick={() => onTabChange('all')}
        className={`flex items-center px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-green-30 font-semibold text-green-30' : 'text-gray-500'}`}
      >
        전체
      </button>
      <button
        onClick={() => onTabChange('incomplete')}
        className={`flex items-center px-4 py-2 ${activeTab === 'incomplete' ? 'border-b-2 border-green-30 font-semibold text-green-30' : 'text-gray-500'}`}
      >
        진행 중
      </button>
      <button
        onClick={() => onTabChange('completed')}
        className={`flex items-center px-4 py-2 ${activeTab === 'completed' ? 'border-b-2 border-green-30 font-semibold text-green-30' : 'text-gray-500'}`}
      >
        진행 완료
      </button>
    </div>
  )
}
