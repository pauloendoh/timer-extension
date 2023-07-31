import { setSync } from '../../utils/chromeStoragePromises'
import { messageTypes } from '../../utils/messageTypes'
import { syncKeys } from '../../utils/syncKeys'
import { bgHandleRedirectTab } from './bgHandleRedirectTab'
import { handleGithubIssuePage } from './handleGithubIssuePage'
import { handleRelearnResource } from './handleRelearnResource'

export const background_handleTab = async (
  tab: chrome.tabs.Tab,
  options?: {
    type: 'open'
  }
) => {
  if (!tab.url || !tab.id) return
  if (tab.url.includes('github.com') && tab.url.includes('/issues/')) {
    handleGithubIssuePage(tab)
  }

  chrome.tabs.sendMessage(tab.id, {
    type: messageTypes.initReactApp,
    tabId: tab.id,
  })

  handleRelearnResource(tab)

  bgHandleRedirectTab(tab)

  if (options?.type === 'open') {
    if (!tab.id) return
    setSync(syncKeys.linkScan(tab.id.toString()), false)
  }
}
