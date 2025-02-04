import { messageTypes } from './utils/messageTypes'

let currentComment: HTMLElement | null = null

// get runtime tab

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.type === messageTypes.alert) {
    alert(msg.message)
  }
})
