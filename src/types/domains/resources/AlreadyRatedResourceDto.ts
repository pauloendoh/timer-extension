export interface AlreadyRatedResourceDto {
  found: boolean
  resource: ResourceDto | null
}

export interface ResourceDto {
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
