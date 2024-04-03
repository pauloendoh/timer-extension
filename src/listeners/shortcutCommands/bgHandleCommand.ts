import { isValidGithubPage } from '../../utils/github-issues/isValidGithubPage'
import { bgHandleGithubIssuesCommand } from './bgHandleGithubIssuesCommand'

export const bgHandleCommand = (command: string, tab: chrome.tabs.Tab) => {
  if (!tab.url) return
  if (command === 'nextIssue' || command === 'prevIssue') {
    if (isValidGithubPage(tab.url)) {
      bgHandleGithubIssuesCommand(command, tab)
    }
  }
}
