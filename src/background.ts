import { handleBadgeAsync } from './listeners/background/handleBadge'
import { IssuesState } from './listeners/background/handleGithubIssuePage'
import { handleTab } from './listeners/background/handleTab'
import { bgHandleCommand } from './listeners/shortcutCommands/bgHandleCommand'
import { setSync } from './utils/chromeStoragePromises'
import { getCurrentTab } from './utils/getCurrentTab'
import { storageKeys } from './utils/storageKeys'

function polling() {
  setTimeout(polling, 1000 * 30)
}

polling()

setSync(storageKeys.issues, {
  currentVoteCountIndex: 0,
  voteCounts: [],
  prevIssuesUrl: '',
  started: false,
} as IssuesState)

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    handleTab(tab)
  })

  handleBadgeAsync()
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  handleTab(tab)
})

// listen to focused windows tab
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // No window is focused. All Chrome windows are blurred.
    return
  }

  const tab = await getCurrentTab()
  handleTab(tab)
})

chrome.commands.onCommand.addListener(function (command, tab) {
  bgHandleCommand(command, tab)
})
