import { resetAuthStore } from './zustand/useAuthStore'

export const useLogout = () => {
  // const { showSuccessToast } = useMyToast()
  // const axios = useAxios()

  const logout = async () => {
    resetAuthStore()
    // showSuccessToast("Logged out!")
  }
  return logout
}
