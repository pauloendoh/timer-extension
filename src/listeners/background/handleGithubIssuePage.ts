import { VoteCount } from '../../types/types'
import { syncGet, syncSet } from '../../utils/chromeStoragePromises'
import { messageTypes } from '../../utils/messageTypes'
import { storageKeys } from '../../utils/storageKeys'

export type IssuesState = {
  started: boolean
  voteCounts: VoteCount[]
  currentVoteCountIndex: number
  prevIssuesUrl: string
}

export const handleGithubIssuePage = async (tab: chrome.tabs.Tab) => {
  const state = await syncGet<IssuesState>(storageKeys.issues)
  if (tab.url !== state?.prevIssuesUrl) {
    await getHighestVotes(tab)
  }
}

const getHighestVotes = async (tab: chrome.tabs.Tab) => {
  const currentUrl = tab.url

  if (!tab?.id || !currentUrl) return

  if (currentUrl.includes('github.com') && currentUrl.includes('/issues/')) {
    chrome.tabs.sendMessage(
      tab.id,
      {
        type: messageTypes.getHighestVotes,
      },
      (response: VoteCount[]) => {
        if (!response) return
        if (response.length > 0) {
          const newState: IssuesState = {
            voteCounts: response,
            currentVoteCountIndex: -1,
            started: true,
            prevIssuesUrl: currentUrl,
          }

          syncSet(storageKeys.issues, newState)
        }
      }
    )

    return
  }

  await syncSet(storageKeys.issues, {
    started: false,
    voteCounts: [],
    currentVoteCountIndex: -1,
    prevIssuesUrl: currentUrl,
  })
}
