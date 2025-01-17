import { getFormattedTimeRemaining } from '../../../components/popup/TimerPopup/getFormattedTimeRemaining/getFormattedTimeRemaining'
import { startAudio } from '../../../components/popup/TimerPopup/startAudio/startAudio'

let interval: NodeJS.Timeout | null = null
let remainingMs = 0

export const bgHandleStartTimer = (totalMillis: number) => {
  if (interval) {
    clearInterval(interval)
  }

  remainingMs = totalMillis

  interval = setInterval(() => {
    remainingMs -= 1000
    chrome.action.setBadgeText({
      text: getFormattedTimeRemaining(remainingMs),
    })

    if (remainingMs <= 0) {
      if (interval) {
        clearInterval(interval)
      }
      chrome.action.setBadgeText({
        text: '🔔',
      })
      chrome.action.setBadgeBackgroundColor({
        color: '#ff0000',
      })
      startAudio()
    }
  }, 1000)
}

export const bgHandleCancelTimer = () => {
  if (interval) {
    clearInterval(interval)
  }

  chrome.action.setBadgeText({
    text: '',
  })
  chrome.action.setBadgeBackgroundColor({
    color: 'transparent',
  })
}

export const bgHandleGetRemainingMs = () => {
  return remainingMs
}
