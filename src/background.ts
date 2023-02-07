import { VoteCount } from './types/types'
import { getCurrentTab } from './utils/getCurrentTab'
import { messageTypes } from './utils/messageTypes'

function polling() {
  console.log('polling')
  setTimeout(polling, 1000 * 30)
}

polling()

let prevIssuesUrl = ''
let voteCounts: VoteCount[] = []
let currentVoteCountIndex = -1
let started = false

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    console.log('URL: ', tab.url)
  })
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log('URL: ', tab.url)
})

// listen to focused windows tab
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // No window is focused. All Chrome windows are blurred.
    return
  }

  const tab = await getCurrentTab()
  console.log('URL: ', tab.url)
})

const getHighestVotes = (tab: chrome.tabs.Tab) => {
  const currentUrl = tab.url

  console.log({
    tabId: tab.id,
    currentUrl,
  })
  if (!tab?.id || !currentUrl) return

  if (currentUrl.includes('github.com') && currentUrl.includes('/issues/')) {
    chrome.tabs.sendMessage(
      tab.id,
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
}

chrome.commands.onCommand.addListener(function (command, tab) {
  if (tab.url !== prevIssuesUrl) {
    getHighestVotes(tab)
  }

  console.log(command)
  if (command === 'next' || command === 'prev') {
    const currentUrl = tab.url

    const tabId = tab.id

    if (!tabId || !currentUrl) return

    if (command === 'prev' && currentVoteCountIndex > 0) currentVoteCountIndex--
    if (command === 'next' && currentVoteCountIndex < voteCounts.length - 1)
      currentVoteCountIndex++

    if (currentVoteCountIndex < 0) currentVoteCountIndex = 0

    console.log({
      voteCounts,
      currentVoteCountIndex,
    })

    let voteCount = voteCounts[currentVoteCountIndex]
    if (!voteCount) {
      currentVoteCountIndex === 0
      voteCount = voteCounts[currentVoteCountIndex]
    }
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
