import { VoteCount } from './types/types'
import { messageTypes } from './utils/messageTypes'

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log({
    sender,
  })
  if (msg.type === messageTypes.getHighestVotes) {
    console.log('listening')
    // document query selector
    const results: VoteCount[] = []

    const voteComments = document.querySelectorAll('.timeline-comment-group')
    console.log({
      voteComments,
    })

    for (const comment of voteComments) {
      const id = comment.getAttribute('id')
      if (!id) continue
      let voteCount = 0
      const reactions = comment.querySelector('.js-comment-reactions-options')
      if (!reactions) continue
      const likeCountHtml = reactions.querySelector(
        '[aria-label="react with thumbs up"]'
      )
      if (likeCountHtml && likeCountHtml.textContent) {
        const number = parseInt(likeCountHtml.textContent.split(`\n`)[1])
        if (number) voteCount = number
      }

      results.push({
        commentId: id,
        voteCount,
      })
    }

    sendResponse(results.sort((a, b) => b.voteCount - a.voteCount))
    return
  }

  if (msg.type === messageTypes.scrollToComment) {
    const url = new URL(msg.url)
    const commentId = url.hash.replace('#', '')
    const comment = document.getElementById(commentId)
    if (comment) {
      comment.scrollIntoView()
    }
    sendResponse('Scroll to comment')
    return
  }

  if (msg.color) {
    console.log('Receive color = ' + msg.color)
    document.body.style.backgroundColor = msg.color
    sendResponse('Change color to ' + msg.color)
  } else {
    sendResponse('Color message is none.')
  }
})
