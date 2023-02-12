import { IssuesState } from './listeners/background/handleGithubIssuePage'
import { handleTab } from './listeners/background/handleTab'
import { handleCommand } from './listeners/shortcutCommands/handleCommand'
import { syncSet } from './utils/chromeStoragePromises'
import { getCurrentTab } from './utils/getCurrentTab'
import { storageKeys } from './utils/storageKeys'

function polling() {
  console.log('polling')
  setTimeout(polling, 1000 * 30)
}

polling()

syncSet(storageKeys.issues, {
  currentVoteCountIndex: 0,
  voteCounts: [],
  prevIssuesUrl: '',
  started: false,
} as IssuesState)

chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('Ronaldo')
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    handleTab(tab)
  })
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
  handleCommand(command, tab)
})

// background.js
chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  console.log('wake me up')
})

chrome.webRequest.onSendHeaders.addListener(
  (details) => {
    // code here
  },
  {
    urls: ['https://example.com/api/*'],
    types: ['xmlhttprequest'],
  },
  ['requestHeaders']
)
