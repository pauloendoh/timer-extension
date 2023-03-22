import fetchIntercept from 'fetch-intercept'

import { AuthUserGetDto } from '../types/domains/AuthUserGetDto'
import { getSync } from './chromeStoragePromises'
import { storageKeys } from './storageKeys'

const unregister = fetchIntercept.register({
  request: async function (url, config) {
    const user = await getSync<AuthUserGetDto>(storageKeys.user)
    if (user) {
      if (!config || !config.headers) config = { headers: {} }
      config.headers['x-auth-token'] = user.token
      // Keep-Alive
      config.headers['Connection'] = 'keep-alive'
    }
    return [url, config]
  },
})

export const myFetch = fetch
