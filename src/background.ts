import { background_handleTab } from './listeners/background/background_handleTab'
import { handleBadgeAsync } from './listeners/background/handleBadge'
import { IssuesState } from './listeners/background/handleGithubIssuePage'
import { bgHandleCommand } from './listeners/shortcutCommands/bgHandleCommand'
import { background_getCurrentTab } from './utils/background_getCurrentTab'
import { setSync } from './utils/chromeStoragePromises'
import { messageTypes } from './utils/messageTypes'
import { syncKeys } from './utils/syncKeys'

function polling() {
  setTimeout(polling, 1000 * 30)
}

polling()

setSync(syncKeys.issues, {
  currentVoteCountIndex: 0,
  voteCounts: [],
  prevIssuesUrl: '',
  started: false,
} as IssuesState)

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    background_handleTab(tab)
  })

  handleBadgeAsync()
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  background_handleTab(tab, {
    type: 'open',
  })
})

// listen to focused windows tab
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // No window is focused. All Chrome windows are blurred.
    return
  }
  const tab = await background_getCurrentTab()
  background_handleTab(tab)
})

chrome.commands.onCommand.addListener(function (command, tab) {
  bgHandleCommand(command, tab)
})

chrome.runtime.onInstalled.addListener((details) => {
  chrome.contextMenus.create({
    title: 'Toggle link scanning',
    id: 'relearn-context-menu',
    contexts: ['page'],
  })
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (!tab?.id) return
    if (info.menuItemId === 'relearn-context-menu') {
      chrome.tabs.sendMessage(tab.id, {
        type: messageTypes.toggleLinkScan,
        tabId: tab.id,
      })
    }
  })

  chrome.contextMenus.create({
    title: 'Save current page',
    id: 'relearn-save-current-page',
    contexts: ['page'],
  })
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (!tab?.id) return
    if (info.menuItemId === 'relearn-save-current-page') {
      chrome.tabs.sendMessage(tab.id, {
        type: messageTypes.checkAndOpenResourceModal,
        tabId: tab.id,
        url: tab.url,
      })
    }
  })
})
