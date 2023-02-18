import { bgHandleRedirectTab } from './bgHandleRedirectTab'
import { handleGithubIssuePage } from './handleGithubIssuePage'
import { handleRelearnResource } from './handleRelearnResource'

export const handleTab = async (tab: chrome.tabs.Tab) => {
  console.log('url', tab.url)
  if (!tab.url) return
  if (tab.url.includes('github.com') && tab.url.includes('/issues/')) {
    handleGithubIssuePage(tab)
  }

  handleRelearnResource(tab)

  bgHandleRedirectTab(tab)
}
