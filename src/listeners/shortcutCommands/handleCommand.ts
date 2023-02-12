import { handleGithubIssuesCommand } from './handleGithubIssuesCommand'

export const handleCommand = (command: string, tab: chrome.tabs.Tab) => {
  if (!tab.url) return
  if (command === 'next' || command === 'prev') {
    if (tab.url.includes('github.com') && tab.url.includes('/issues/')) {
      handleGithubIssuesCommand(command, tab)
    }
  }
}
