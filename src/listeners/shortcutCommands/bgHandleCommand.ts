import { bgHandleGithubIssuesCommand } from './bgHandleGithubIssuesCommand'

export const bgHandleCommand = (command: string, tab: chrome.tabs.Tab) => {
  if (!tab.url) return
  if (command === 'nextIssue' || command === 'prevIssue') {
    if (tab.url.includes('github.com') && tab.url.includes('/issues/')) {
      bgHandleGithubIssuesCommand(command, tab)
    }
  }
}
