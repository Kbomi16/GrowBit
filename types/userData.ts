export type UserData = {
  id: string
  email: string
  bio: string
  profileImage: string
  nickname: string
  friends?: string[]
  friendsDetails?: {
    id: string
    nickname: string
    bio: string
  }[]
}

export type FriendData = {
  id: string
  nickname: string
  bio: string
}
