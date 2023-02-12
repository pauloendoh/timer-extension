import { handleGithubIssuePage } from './handleGithubIssuePage'
import { handleRelearnResource } from './handleRelearnResource'

export const handleTab = (tab: chrome.tabs.Tab) => {
  console.log('url', tab.url)
  if (!tab.url) return
  if (tab.url.includes('github.com') && tab.url.includes('/issues/')) {
    handleGithubIssuePage(tab)
  }

  handleRelearnResource(tab)
}
