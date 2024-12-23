import { ChangeEvent, FormEvent, Dispatch, SetStateAction } from 'react'
import { FiUser, FiEdit2, FiLogOut } from 'react-icons/fi'
import Image from 'next/image'
import { auth, db } from '@/app/_utils/firebaseConfig'
import { doc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { UserData } from '@/types/userData'

type ProfileProps = {
  userData: UserData
  setUserData: Dispatch<SetStateAction<UserData>>
  isEditing: boolean
  setIsEditing: Dispatch<SetStateAction<boolean>>
  tempUserData: UserData
  setTempUserData: Dispatch<SetStateAction<UserData>>
  userUid: string | undefined
}

export default function Profile({
  userData,
  setUserData,
  isEditing,
  setIsEditing,
  tempUserData,
  setTempUserData,
  userUid,
}: ProfileProps) {
  const router = useRouter()

  // 사용자 정보 업데이트
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault()
    if (!userUid) return

    const userDocRef = doc(db, 'users', userUid)
    await updateDoc(userDocRef, tempUserData)

    setUserData(tempUserData)
    setIsEditing(false)
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setTempUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleCancel = () => {
    setTempUserData(userData)
    setIsEditing(false)
  }

  const handleLogout = async () => {
    await auth.signOut()
    router.push('/login')
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">
        {`"${userData.nickname}"님의 정보`}
      </h1>
      <div className="mb-6 flex items-center justify-start">
        {userData.profileImage ? (
          <Image
            src={userData.profileImage}
            alt="Profile Image"
            className="mr-4 h-24 w-24 rounded-full border-2 border-gray-300 object-cover"
          />
        ) : (
          <div className="mr-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-200">
            <FiUser className="h-12 w-12 text-gray-500" />
          </div>
        )}
        <div>
          <div className="text-xl font-semibold">{userData.nickname}</div>
          <div className="text-gray-500">{userData.email}</div>
        </div>
      </div>
      <div className="mb-2">
        <div className="text-lg font-semibold">✍🏻한 줄 소개</div>
        {isEditing ? (
          <input
            name="bio"
            value={tempUserData.bio || ''}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border-2 border-gray-300 p-2 focus:border-green-30 focus:outline-none"
            placeholder="자기소개를 입력하세요"
          />
        ) : (
          <p className="mt-2 text-gray-600">
            {userData.bio || '소개가 없습니다'}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdate}
                className="rounded-full bg-green-30 px-4 py-2 text-white transition hover:bg-green-40"
              >
                저장
              </button>
              <button
                onClick={handleCancel}
                className="rounded-full border-2 border-green-30 bg-white px-4 py-2 text-black transition hover:bg-green-30 hover:text-white"
              >
                취소
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-full bg-green-30 px-4 py-2 text-white transition hover:bg-green-40"
            >
              <FiEdit2 className="inline" /> 프로필 편집
            </button>
          )}
        </div>
        <hr />
        <button
          onClick={handleLogout}
          className="flex items-center rounded-full border-2 border-slate-100 p-2 px-4 text-gray-600 transition hover:bg-slate-100"
        >
          <FiLogOut className="mr-2 text-gray-600" /> 로그아웃
        </button>
      </div>
    </div>
  )
}
