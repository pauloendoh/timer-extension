import { VoteCount } from './types/types'
import { messageTypes } from './utils/messageTypes'

function polling() {
  console.log('polling')
  setTimeout(polling, 1000 * 30)
}

polling()

let voteCounts: VoteCount[] = []
let currentVoteCountIndex = -1
let started = false

// listen to new url open
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

  started = false
  voteCounts = []
  currentVoteCountIndex = -1
})

chrome.commands.onCommand.addListener(function (command, tab) {
  console.log(command)
  if (command === 'next' || command === 'prev') {
    // open popup html

    const currentUrl = tab.url

    const tabId = tab.id

    if (!tabId || !currentUrl) return

    if (command === 'prev' && currentVoteCountIndex > 0) currentVoteCountIndex--
    if (command === 'next' && currentVoteCountIndex < voteCounts.length - 1)
      currentVoteCountIndex++
    console.log({
      voteCounts,
      currentVoteCountIndex,
    })

    const voteCount = voteCounts[currentVoteCountIndex]
    if (
      voteCount &&
      currentUrl.includes('github.com') &&
      currentUrl.includes('/issues/')
    ) {
      const startUrl = currentUrl.split('#')[0]
      const url = `${startUrl}#${voteCount.commentId}`

      console.log('sending', voteCount.commentId)
      chrome.tabs.sendMessage(tabId, {
        type: messageTypes.scrollToComment,
        commentId: voteCount.commentId,
      })

      return
    }
  }
})
