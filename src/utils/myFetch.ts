import fetchIntercept from 'fetch-intercept'

import { AuthUserGetDto } from '../types/domains/AuthUserGetDto'
import { syncGet } from './chromeStoragePromises'
import { storageKeys } from './storageKeys'

const unregister = fetchIntercept.register({
  request: async function (url, config) {
    console.log({
      url,
      config,
    })
    const user = await syncGet<AuthUserGetDto>(storageKeys.user)
    if (user) {
      if (!config) config = { headers: {} }
      config.headers['x-auth-token'] = user.token
    }
    return [url, config]
  },
})

export const myFetch = fetch
