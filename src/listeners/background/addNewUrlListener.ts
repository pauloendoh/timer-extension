import { VoteCount } from '../../types/types'
import { messageTypes } from '../../utils/messageTypes'

export const addNewUrlListener = async () => {
  let voteCounts: VoteCount[] = []
  let currentVoteCountIndex = -1
  let started = false

  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    const currentUrl = tab.url

    if (!tabId || !currentUrl) return

    if (currentUrl.includes('github.com') && currentUrl.includes('/issues/')) {
      chrome.tabs.sendMessage(
        tabId,
        {
          type: messageTypes.getHighestVotes,
        },
        (response: VoteCount[]) => {
          if (!started && response.length > 0) {
            voteCounts = response

            currentVoteCountIndex = -1
            started = true
          }
        }
      )

      return
    }
  })
}
