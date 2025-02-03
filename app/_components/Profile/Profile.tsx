'use client'
import { useState, ChangeEvent, FormEvent } from 'react'
import { FiUser, FiEdit2, FiLogOut } from 'react-icons/fi'
import Image from 'next/image'
import { auth, db, storage } from '@/app/_libs/firebaseConfig'
import { doc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { UserData } from '@/types/userData'
import { User } from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

type ProfileProps = {
  userData: UserData
  setUserData: (data: UserData) => void
  user: User | null
}

export default function Profile({ userData, setUserData }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempUserData, setTempUserData] = useState<UserData>(userData)
  const [imageFile, setImageFile] = useState<File | null>(null) // 이미지 파일 상태 추가
  const [imagePreview, setImagePreview] = useState<string | null>(null) // 미리보기 상태 추가

  const router = useRouter()

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault()
    if (!auth.currentUser?.uid) return

    let profileImageUrl = userData.profileImage

    // 이미지 파일이 존재하면 업로드 진행
    if (imageFile) {
      // Firebase Storage에 업로드할 파일 참조를 생성
      const imageRef = ref(storage, `profile_images/${auth.currentUser.uid}`)
      await uploadBytes(imageRef, imageFile) // 이미지 업로드

      // 업로드 후 다운로드 URL 얻기
      profileImageUrl = await getDownloadURL(imageRef)
    }

    const userDocRef = doc(db, 'users', auth.currentUser.uid)
    await updateDoc(userDocRef, {
      ...tempUserData,
      profileImage: profileImageUrl,
    })
    setUserData({ ...tempUserData, profileImage: profileImageUrl })
    setIsEditing(false)

    alert('프로필이 업데이트되었습니다!')
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file) // 이미지 파일 상태 업데이트
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string) // 미리보기 업데이트
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCancel = () => {
    setTempUserData(userData)
    setIsEditing(false)
    setImagePreview(null) // 이미지 미리보기 취소
  }

  const handleLogout = async () => {
    await auth.signOut()
    router.push('/login')
  }

  const handleImageReset = () => {
    setImageFile(null) // 이미지 파일 초기화
    setImagePreview(null) // 미리보기 초기화
  }

  return (
    <div className="flex flex-col lg:flex-row">
      <div className="relative mb-6 flex items-center justify-center lg:mb-0 lg:w-1/3">
        <div className="relative h-48 w-48 overflow-hidden rounded-full border-2 border-gray-300 bg-gray-200">
          {imagePreview || userData.profileImage ? (
            <Image
              src={imagePreview || userData.profileImage}
              alt="Profile Image"
              className="h-full w-full object-cover"
              width={192}
              height={192}
            />
          ) : (
            <FiUser className="flex h-full w-full items-center justify-center text-gray-500" />
          )}
        </div>
        {isEditing && (
          <div className="absolute bottom-0 right-0 flex flex-col items-center justify-center rounded-xl border-2 bg-white p-3">
            <label
              htmlFor="profile-image"
              className="cursor-pointer rounded-lg py-1 text-sm text-black"
            >
              <FiEdit2 className="mr-1 inline" /> 프로필 변경
            </label>
            <hr className="my-2 w-full border-gray-300" />
            <button
              onClick={handleImageReset}
              className="rounded-lg pt-1 text-sm text-black"
            >
              기본 이미지로 변경
            </button>

            <input
              type="file"
              id="profile-image"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        )}
      </div>

      <div className="ml-4 lg:w-2/3">
        <h1 className="mb-4 flex items-center text-2xl font-semibold">
          <FiUser className="mr-2" /> {`"${userData.nickname}"님의 정보`}
        </h1>
        <div className="mb-6 flex items-center justify-start">
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
              className="mt-2 w-full rounded-lg border-2 border-gray-300 p-2 focus:border-green-500 focus:outline-none"
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
                  className="rounded-full bg-green-40 px-4 py-2 text-white transition hover:bg-green-50"
                >
                  저장
                </button>
                <button
                  onClick={handleCancel}
                  className="rounded-full border-2 border-green-40 bg-white px-4 py-2 text-black transition hover:bg-green-40 hover:text-white"
                >
                  취소
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-full bg-green-40 px-4 py-2 text-white transition hover:bg-green-50"
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
    </div>
  )
}
