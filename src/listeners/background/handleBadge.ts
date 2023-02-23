import { getSync } from '../../utils/chromeStoragePromises'
import { storageKeys } from '../../utils/storageKeys'

export const handleBadgeAsync = async () => {
  const redirectIsActive = await getSync<boolean>(
    storageKeys.siteRedirect.isActive
  )
  chrome.action.setBadgeText({
    text: redirectIsActive ? 'On' : 'Off',
  })
  chrome.action.setBadgeBackgroundColor({
    color: redirectIsActive ? '#8957e5' : '#ff0000',
  })
}
