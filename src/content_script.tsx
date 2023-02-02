import { VoteCount } from './types/types'
import { messageTypes } from './utils/messageTypes'

let currentComment: HTMLElement | null = null

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.log({
    sender,
    msg,
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

    sendResponse(
      results
        .filter((result) => result.voteCount > 0)
        .sort((a, b) => b.voteCount - a.voteCount)
    )
    return
  }

  if (msg.type === messageTypes.scrollToComment) {
    const commentId = msg.commentId
    console.log({
      commentId,
    })
    const comment = document
      .getElementById(commentId)
      ?.querySelector('.timeline-comment') as HTMLElement | null
    if (comment) {
      if (currentComment) {
        currentComment.style.border = 'none'
      }
      currentComment = comment
      comment.style.border = '4px solid #8957e5'

      const y = comment.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: y - 200,
        behavior: 'smooth',
      })
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
