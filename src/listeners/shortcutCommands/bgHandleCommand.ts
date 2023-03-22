import { messageTypes } from '../../utils/messageTypes'
import { bgHandleGithubIssuesCommand } from './bgHandleGithubIssuesCommand'

export const bgHandleCommand = (command: string, tab: chrome.tabs.Tab) => {
  if (!tab.url) return
  if (command === 'nextIssue' || command === 'prevIssue') {
    if (
      tab.url.includes('github.com') &&
      (tab.url.includes('/issues/') || tab.url.includes('/discussions/'))
    ) {
      if (tab.url.includes('/discussions/')) {
        chrome.tabs.sendMessage(tab.id!, {
          type: messageTypes.alert,
          message: 'Discussion page not supported',
        })
        return
      }
      bgHandleGithubIssuesCommand(command, tab)
    }
  }
}
