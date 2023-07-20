import { ResourceDto } from './ResourceDto'

export interface AlreadyRatedResourceDto {
  found: boolean
  resource: ResourceDto | null
}
