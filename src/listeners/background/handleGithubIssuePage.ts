import { VoteCount } from '../../types/types'
import { getSync, setSync } from '../../utils/chromeStoragePromises'
import { messageTypes } from '../../utils/messageTypes'
import { storageKeys } from '../../utils/storageKeys'

export type IssuesState = {
  started: boolean
  voteCounts: VoteCount[]
  currentVoteCountIndex: number
  prevIssuesUrl: string
}

export const handleGithubIssuePage = async (tab: chrome.tabs.Tab) => {
  const state = await getSync<IssuesState>(storageKeys.issues)
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

          setSync(storageKeys.issues, newState)
        }
      }
    )

    return
  }

  await setSync(storageKeys.issues, {
    started: false,
    voteCounts: [],
    currentVoteCountIndex: -1,
    prevIssuesUrl: currentUrl,
  })
}
