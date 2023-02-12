import { handleGithubIssuePage } from './handleGithubIssuePage'

export const handleTab = (tab: chrome.tabs.Tab) => {
  console.log('URL: ', tab.url)

  if (!tab.url) return
  if (tab.url.includes('github.com') && tab.url.includes('/issues/')) {
    handleGithubIssuePage(tab)
  }
}
