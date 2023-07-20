import { ResourceDto } from "./ResourceDto"

export interface TagDto {
  id: number | null
  userId: number | null
  name: string
  position: number | null
  color: string
  isPrivate: boolean
  createdAt: string
  updatedAt: string
  lastOpenedAt: string | null
  resources: ResourceDto[]
}

export const newTagDto = (): TagDto => ({
  id: null,
  userId: null,
  name: "",
  position: null,
  color: "#ffffff",
  isPrivate: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastOpenedAt: null,
  resources: [],
})
