import { syncGet, syncSet } from '../../utils/chromeStoragePromises'
import { messageTypes } from '../../utils/messageTypes'
import { storageKeys } from '../../utils/storageKeys'
import { IssuesState } from '../background/handleGithubIssuePage'

export const handleGithubIssuesCommand = async (
  command: string,
  tab: chrome.tabs.Tab
) => {
  const currentUrl = tab.url

  const tabId = tab.id

  if (!tabId || !currentUrl) return

  let state = await syncGet<IssuesState>(storageKeys.issues)
  if (!state) return

  if (command === 'prev' && state.currentVoteCountIndex > 0) {
    state = await syncSet(storageKeys.issues, {
      ...state,
      currentVoteCountIndex: state.currentVoteCountIndex - 1,
    })
  }

  if (
    command === 'next' &&
    state.currentVoteCountIndex < state.voteCounts.length - 1
  )
    state = await syncSet(storageKeys.issues, {
      ...state,
      currentVoteCountIndex: state.currentVoteCountIndex + 1,
    })

  if (state.currentVoteCountIndex < 0) {
    state = await syncSet(storageKeys.issues, {
      ...state,
      currentVoteCountIndex: 0,
    })
  }

  let voteCount = state.voteCounts[state.currentVoteCountIndex]
  if (!voteCount) {
    state.currentVoteCountIndex === 0
    voteCount = state.voteCounts[state.currentVoteCountIndex]
  }
  if (
    voteCount &&
    currentUrl.includes('github.com') &&
    currentUrl.includes('/issues/')
  ) {
    chrome.tabs.sendMessage(tabId, {
      type: messageTypes.scrollToComment,
      commentId: voteCount.commentId,
    })

    return
  }
}
