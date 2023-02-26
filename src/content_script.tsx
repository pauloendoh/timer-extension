import { getHighestVotes } from './listeners/content_script/github-issues/getHighestVotes'
import { csHandleResource } from './listeners/content_script/relearn/csHandleResource'
import { csHideRelearnButton } from './listeners/content_script/relearn/csHideRelearnButton'
import { messageTypes } from './utils/messageTypes'

let currentComment: HTMLElement | null = null

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.type === messageTypes.getHighestVotes) {
    return getHighestVotes(sendResponse)
  }

  if (msg.type === messageTypes.scrollToComment) {
    const commentId = msg.commentId

    const comment = document
      .getElementById(commentId)
      ?.querySelector('.comment-reactions') as HTMLElement | null
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

  if (msg.type === messageTypes.alert) {
    alert(msg.message)
  }

  if (msg.type === messageTypes.handleResource) {
    csHandleResource(msg.resource)
  }

  if (msg.type === messageTypes.hideRelearnButton) {
    csHideRelearnButton()
  }
})
