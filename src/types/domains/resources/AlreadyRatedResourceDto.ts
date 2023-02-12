export interface AlreadyRatedResourceDto {
  found: boolean
  resource: Resource | null
}

interface Resource {
  id: number
  userId: number
  title: string
  url: string
  thumbnail: string
  estimatedTime: string
  dueDate: string
  rating: number | null
  completedAt: string
  position: number
  publicReview: string
  privateNote: string
  createdAt: string
  updatedAt: string
  tagId: number
}
