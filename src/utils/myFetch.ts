import fetchIntercept from 'fetch-intercept'

import { AuthUserGetDto } from '../types/domains/AuthUserGetDto'
import { getSync } from './chromeStoragePromises'
import { syncKeys } from './syncKeys'

const unregister = fetchIntercept.register({
  request: async function (url, config) {
    const user = await getSync<AuthUserGetDto>(syncKeys.user)
    if (user) {
      if (!config || !config.headers) {
        config = { headers: {} }
      }

      config.headers['x-auth-token'] = user.token
      // Keep-Alive
      config.headers['Connection'] = 'keep-alive'
      config.headers['Content-Type'] = 'application/json'
    }
    return [url, config]
  },
})

export const myFetch = fetch
