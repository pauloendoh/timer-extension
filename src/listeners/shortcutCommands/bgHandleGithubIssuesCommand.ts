import { getSync, setSync } from '../../utils/chromeStoragePromises'
import { isValidGithubPage } from '../../utils/github-issues/isValidGithubPage'
import { messageTypes } from '../../utils/messageTypes'
import { syncKeys } from '../../utils/syncKeys'
import { IssuesState } from '../background/background_handleGithubPage'

export const bgHandleGithubIssuesCommand = async (
  command: string,
  tab: chrome.tabs.Tab
) => {
  const currentUrl = tab.url

  const tabId = tab.id

  if (!tabId || !currentUrl) return

  let state = await getSync<IssuesState>(syncKeys.issues)
  if (!state || state.voteCounts.length === 0) {
    // send alert to content_script
    chrome.tabs.sendMessage(tabId, {
      type: messageTypes.alert,
      message: 'No votes found',
    })

    return
  }

  if (command === 'prevIssue' && state.currentVoteCountIndex > 0) {
    state = await setSync(syncKeys.issues, {
      ...state,
      currentVoteCountIndex: state.currentVoteCountIndex - 1,
    })
  }

  if (
    command === 'nextIssue' &&
    state.currentVoteCountIndex < state.voteCounts.length - 1
  )
    state = await setSync(syncKeys.issues, {
      ...state,
      currentVoteCountIndex: state.currentVoteCountIndex + 1,
    })

  if (state.currentVoteCountIndex < 0) {
    state = await setSync(syncKeys.issues, {
      ...state,
      currentVoteCountIndex: 0,
    })
  }

  let voteCount = state.voteCounts[state.currentVoteCountIndex]
  if (!voteCount) {
    voteCount = state.voteCounts[state.currentVoteCountIndex]
  }
  if (voteCount && isValidGithubPage(currentUrl)) {
    chrome.tabs.sendMessage(tabId, {
      type: messageTypes.scrollToComment,
      commentId: voteCount.commentId,
    })
  }
}
