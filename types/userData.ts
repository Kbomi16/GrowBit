export type UserData = {
  email: string
  bio: string
  profileImage: string
  nickname: string
  friends?: string[]
  friendsDetails?: { id: string; nickname: string; bio: string }[]
}
