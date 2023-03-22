import { VoteCount } from '../../../types/types'

export const getHighestVotes = (sendResponse: (response?: any) => void) => {
  const results: VoteCount[] = []

  const voteComments = document.querySelectorAll('.timeline-comment-group')

  for (const comment of voteComments) {
    const id = comment.getAttribute('id')
    if (!id) continue
    let likeCount = 0
    let loveCount = 0
    let hoorayCount = 0
    let rocketCount = 0
    let smileCount = 0
    let sadCount = 0
    let dislikeCount = 0

    const reactions = comment.querySelector('.js-comment-reactions-options')
    if (!reactions) continue

    const likeCountHtml = reactions.querySelector(
      '[aria-label="react with thumbs up"]'
    )
    if (likeCountHtml && likeCountHtml.textContent) {
      const number = parseInt(likeCountHtml.textContent.split(`\n`)[1])
      if (number) likeCount = number
    }

    const loveCountHtml = reactions.querySelector(
      '[aria-label="react with heart"]'
    )
    if (loveCountHtml && loveCountHtml.textContent) {
      const number = parseInt(loveCountHtml.textContent.split(`\n`)[1])
      if (number) loveCount = number
    }

    const hoorayCountHtml = reactions.querySelector(
      '[aria-label="react with hooray"]'
    )
    if (hoorayCountHtml && hoorayCountHtml.textContent) {
      const number = parseInt(hoorayCountHtml.textContent.split(`\n`)[1])
      if (number) hoorayCount = number
    }

    const rocketCountHtml = reactions.querySelector(
      '[aria-label="react with rocket]'
    )
    if (rocketCountHtml && rocketCountHtml.textContent) {
      const number = parseInt(rocketCountHtml.textContent.split(`\n`)[1])
      if (number) rocketCount = number
    }

    const smileCountHtml = reactions.querySelector(
      '[aria-label="react with smile"]'
    )
    if (smileCountHtml && smileCountHtml.textContent) {
      const number = parseInt(smileCountHtml.textContent.split(`\n`)[1])
      if (number) smileCount = number
    }

    const sadCountHtml = reactions.querySelector(
      '[aria-label="react with confused"]'
    )
    if (sadCountHtml && sadCountHtml.textContent) {
      const number = parseInt(sadCountHtml.textContent.split(`\n`)[1])
      if (number) sadCount = number
    }

    const dislikeCountHtml = reactions.querySelector(
      '[aria-label="react with thumbs down"]'
    )
    if (dislikeCountHtml && dislikeCountHtml.textContent) {
      const number = parseInt(dislikeCountHtml.textContent.split(`\n`)[1])
      if (number) dislikeCount = number
    }

    const voteCount =
      likeCount +
      loveCount * 2 +
      hoorayCount * 2 -
      sadCount -
      dislikeCount +
      rocketCount * 2 +
      smileCount * 1

    console.log({
      voteCount,
    })

    results.push({
      commentId: id,
      voteCount,
    })
  }

  const finalResults = results
    .filter((result) => result.voteCount > 0)
    .sort((a, b) => b.voteCount - a.voteCount)

  sendResponse(finalResults)
  return
}
