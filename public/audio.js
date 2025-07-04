document.addEventListener('DOMContentLoaded', function () {
  const audio = document.getElementById('audio')
  audio.volume = 0.25 // Start with volume at 0
  setInterval(() => {
    if (audio.volume < 0.75) {
      audio.volume += 0.01
    }
  }, 500)

  setTimeout(() => {
    audio.pause()
  }, 30000)
})
