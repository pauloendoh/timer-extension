import { createChromeStorageStateHookSync } from 'use-chrome-storage'
import { syncKeys } from '../utils/syncKeys'

export const useMinutesInputStore = createChromeStorageStateHookSync(
  syncKeys.timer.minutesInput,
  ''
)
