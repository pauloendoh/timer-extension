export interface AuthUserGetDto {
  id: number
  username: string
  email: string
  userExpiresAt: string
  isAdmin: boolean
  token: string
  expiresAt: string
}
