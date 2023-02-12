import { handleTab } from './listeners/background/handleTab'
import { handleCommand } from './listeners/shortcutCommands/handleCommand'
import { getCurrentTab } from './utils/getCurrentTab'

function polling() {
  console.log('polling')
  setTimeout(polling, 1000 * 30)
}

polling()

chrome.tabs.onActivated.addListener((activeInfo) => {
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
