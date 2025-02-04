import {
  bgHandleCancelTimer,
  bgHandleGetRemainingMs,
  bgHandleStartTimer,
} from './listeners/background/handlers/bgHandleStartTimer'
import { messageTypes } from './utils/messageTypes'

function polling() {
  setTimeout(polling, 1000 * 30)
}

polling()

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === messageTypes.startTimer) {
    bgHandleStartTimer(message.totalMillis)
  }

  if (message.type === messageTypes.cancelTimer) {
    bgHandleCancelTimer()
  }

  if (message.type === messageTypes.getRemainingMs) {
    const remainingMs = bgHandleGetRemainingMs()
    sendResponse(remainingMs)
  }
})
