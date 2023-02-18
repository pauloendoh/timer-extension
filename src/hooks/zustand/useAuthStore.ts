import { create } from 'zustand'
import { AuthUserGetDto } from '../../types/domains/AuthUserGetDto'
import { setSync } from '../../utils/chromeStoragePromises'
import { storageKeys } from '../../utils/storageKeys'

interface IAuthStore {
  authUser: AuthUserGetDto | null

  setAuthUser: (authUser: AuthUserGetDto) => void
}

const useAuthStore = create<IAuthStore>((set, get) => ({
  authUser: null,

  setAuthUser: (authUser) => {
    setSync(storageKeys.user, authUser)

    set({ authUser })
  },
}))

const initialState = useAuthStore.getState()
export const resetAuthStore = () => {
  chrome.storage.sync.remove('user')
  useAuthStore.setState(initialState, true)
}

export default useAuthStore
