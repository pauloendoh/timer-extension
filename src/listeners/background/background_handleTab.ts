import { setSync } from '../../utils/chromeStoragePromises'
import { isValidGithubPage } from '../../utils/github-issues/isValidGithubPage'
import { messageTypes } from '../../utils/messageTypes'
import { syncKeys } from '../../utils/syncKeys'
import { background_handleGithubPage } from './background_handleGithubPage'
import { bgHandleRedirectTab } from './bgHandleRedirectTab'

export const background_handleTab = async (
  tab: chrome.tabs.Tab,
  options?: {
    type: 'open'
  }
) => {
  if (!tab.url || !tab.id) return
  if (isValidGithubPage(tab.url)) {
    background_handleGithubPage(tab)
  }

  chrome.tabs.sendMessage(tab.id, {
    type: messageTypes.initReactApp,
    tabId: tab.id,
  })

  // handleRelearnResource(tab)

  bgHandleRedirectTab(tab)

  if (options?.type === 'open') {
    if (!tab.id) return
    setSync(syncKeys.linkScan(tab.id.toString()), false)
  }
}
