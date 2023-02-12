import { useState } from 'react'
import { AuthUserGetDto } from '../types/domains/AuthUserGetDto'
import { syncGet } from '../utils/chromeStoragePromises'
import { storageKeys } from '../utils/storageKeys'

import { useLogout } from './useLogout'
import useAuthStore from './zustand/useAuthStore'

const useCheckAuthOrLogout = () => {
  // const logout = useLogoutAndPushIndex();
  const logout = useLogout()

  const [loading, setLoading] = useState(true)

  const setAuthUser = useAuthStore((s) => s.setAuthUser)

  const checkAuthOrLogout = async () => {
    const user = await syncGet<AuthUserGetDto>(storageKeys.user)

    if (!user) {
      return setLoading(false)
    }

    if (user.expiresAt && new Date(user.expiresAt) <= new Date()) {
      logout()
      return setLoading(false)
    }

    setLoading(false)
    return setAuthUser(user)
  }

  return { checkAuthOrLogout, loading }
}

export default useCheckAuthOrLogout
