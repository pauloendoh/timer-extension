export const startAudio = () => {
  chrome.offscreen.createDocument({
    url: chrome.runtime.getURL('audio.html'),
    reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK],
    justification: 'notification',
  })
}
