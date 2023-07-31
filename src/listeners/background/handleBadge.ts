import { getSync } from '../../utils/chromeStoragePromises'
import { syncKeys } from '../../utils/syncKeys'

export const handleBadgeAsync = async () => {
  const redirectIsActive = await getSync<boolean>(
    syncKeys.siteRedirect.isActive
  )
  chrome.action.setBadgeText({
    text: redirectIsActive ? 'On' : 'Off',
  })
  chrome.action.setBadgeBackgroundColor({
    color: redirectIsActive ? '#8957e5' : '#ff0000',
  })
}
