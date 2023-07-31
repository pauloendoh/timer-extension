import axios from 'axios'
import { ValidationError } from 'class-validator'
import { AuthUserGetDto } from '../types/domains/AuthUserGetDto'
import { myNotifications } from '../types/myNotifications'
import { getSync } from '../utils/chromeStoragePromises'
import { syncKeys } from '../utils/syncKeys'

export const useAxios = (params?: { redirectOn401?: boolean }) => {
  const redirectOn401 = params?.redirectOn401 || true

  const localAxios = axios.create()
  // localAxios.defaults.baseURL = process.env.REACT_APP_API_URL

  localAxios.interceptors.request.use(async (config) => {
    const user = await getSync<AuthUserGetDto>(syncKeys.user)
    if (user && config.headers) config.headers['x-auth-token'] = user.token
    return config
  })

  localAxios.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      // unauthenticated -> go to "/"
      if (error?.response?.status === 401 && redirectOn401 && window) {
        window.location.reload()
      }

      if (
        axios.isAxiosError<{ errors: ValidationError[]; message: string }>(
          error
        )
      ) {
        const constraints = error.response?.data?.errors?.[0].constraints
        if (constraints) {
          const [key, value] = Object.entries(constraints)[0]

          myNotifications.error(value)

          return Promise.reject(error)
        }

        myNotifications.error(error.response?.data.message || error.message)
      }

      return Promise.reject(error)
    }
  )

  return localAxios
}
