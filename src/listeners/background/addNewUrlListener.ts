import { VoteCount } from '../../types/types'
import { isValidGithubPage } from '../../utils/github-issues/isValidGithubPage'
import { messageTypes } from '../../utils/messageTypes'

export const addNewUrlListener = async () => {
  let started = false

  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    const currentUrl = tab.url

    if (!tabId || !currentUrl) return

    if (isValidGithubPage(currentUrl)) {
      chrome.tabs.sendMessage(
        tabId,
        {
          type: messageTypes.getHighestVotes,
        },
        (response: VoteCount[]) => {
          if (!started && response.length > 0) {
            started = true
          }
        }
      )
    }
  })
}
