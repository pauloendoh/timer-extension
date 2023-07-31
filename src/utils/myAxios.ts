import axios from 'axios'
import { AuthUserGetDto } from '../types/domains/AuthUserGetDto'
import { getSync } from './chromeStoragePromises'
import { syncKeys } from './syncKeys'

const localAxios = axios.create()

localAxios.interceptors.request.use(async (config) => {
  const user = await getSync<AuthUserGetDto>(syncKeys.user)

  if (user && config.headers) config.headers['x-auth-token'] = user.token
  return config
})

export default localAxios
