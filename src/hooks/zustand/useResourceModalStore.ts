import { create } from 'zustand'
import {
  ResourceDto,
  buildResourceDto,
} from '../../types/domains/resources/ResourceDto'

interface IStore {
  initialValue: ResourceDto
  setInitialValue: (initialValue: ResourceDto) => void
  isOpen: boolean
  openModal: (initialValue: ResourceDto) => void
  closeModal: () => void
}

const useResourceModalStore = create<IStore>((set, get) => ({
  initialValue: buildResourceDto(),
  setInitialValue: (initialValue) => {
    set({ initialValue })
  },

  isOpen: false,
  openModal: (initialValue) => {
    set({ isOpen: true, initialValue })
  },
  closeModal: () => {
    set({ isOpen: false })
  },
}))

export default useResourceModalStore
