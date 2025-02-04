import { FiUser, FiUsers } from 'react-icons/fi'

type UserTabBarProps = {
  activeTab: 'profile' | 'friends'
  setActiveTab: (tab: 'profile' | 'friends') => void
}
export default function UserTabBar({
  activeTab,
  setActiveTab,
}: UserTabBarProps) {
  return (
    <div className="mb-4 flex justify-around border-b border-gray-300">
      <button
        onClick={() => setActiveTab('profile')}
        className={`flex items-center p-2 ${
          activeTab === 'profile'
            ? 'border-b-2 border-green-30 font-bold text-green-30'
            : 'text-gray-500'
        }`}
      >
        <FiUser className="mr-2" /> 프로필
      </button>
      <button
        onClick={() => setActiveTab('friends')}
        className={`flex items-center p-2 ${
          activeTab === 'friends'
            ? 'border-b-2 border-green-30 font-bold text-green-30'
            : 'text-gray-500'
        }`}
      >
        <FiUsers className="mr-2" /> 친구 목록
      </button>
    </div>
  )
}
