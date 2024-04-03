import { setSync } from '../../utils/chromeStoragePromises'
import { isValidGithubPage } from '../../utils/github-issues/isValidGithubPage'
import { messageTypes } from '../../utils/messageTypes'
import { syncKeys } from '../../utils/syncKeys'
import { bgHandleRedirectTab } from './bgHandleRedirectTab'
import { handleGithubIssuePage } from './handleGithubIssuePage'

export const background_handleTab = async (
  tab: chrome.tabs.Tab,
  options?: {
    type: 'open'
  }
) => {
  if (!tab.url || !tab.id) return
  if (isValidGithubPage(tab.url)) {
    handleGithubIssuePage(tab)
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
