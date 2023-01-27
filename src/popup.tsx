import React, { useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom'
import { VoteCount } from './types/types'
import { messageTypes } from './utils/messageTypes'

const Popup = () => {
  const [count, setCount] = useState(0)
  const [currentURL, setCurrentURL] = useState<string>()

  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() })
  }, [count])

  const [voteCounts, setVoteCounts] = useState<VoteCount[]>([])
  const sortedVoteCounts = useMemo(
    () => voteCounts.sort((a, b) => b.voteCount - a.voteCount).slice(0, 10),
    [voteCounts]
  )

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentUrl = tabs[0].url
      const tabId = tabs[0].id
      setCurrentURL(currentUrl)

      if (!tabId || !currentUrl) return
      if (
        currentUrl.includes('github.com') &&
        currentUrl.includes('/issues/')
      ) {
        chrome.tabs.sendMessage(
          tabId,
          {
            type: messageTypes.getHighestVotes,
          },
          (response: VoteCount[]) => {
            setVoteCounts(response)
          }
        )
      }
    })
  }, [])

  const changeBackground = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0]
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            color: '#555555',
          },
          (msg) => {
            console.log('result message:', msg)
          }
        )
      }
    })
  }

  const scrollToComment = (commentId: string) => {
    // close popup
    window.close()

    // send message to scroll to commen
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentUrl = tabs[0].url
      const tabId = tabs[0].id
      setCurrentURL(currentUrl)

      if (!tabId || !currentUrl) return

      const startUrl = currentUrl.split('#')[0]
      const url = `${startUrl}#${commentId}`
      chrome.tabs.update(tabId, { url }, function (response) {
        console.log({
          response,
        })
      })
    })
  }

  return (
    <>
      <ul style={{ width: 300 }}>
        <li>Current URL: {currentURL}</li>
        <li>Current Time: {new Date().toLocaleTimeString()}</li>
      </ul>
      <button
        onClick={() => setCount(count + 1)}
        style={{ marginRight: '5px' }}
      >
        count up
      </button>
      <button onClick={changeBackground}>change background</button>

      <hr />
      <div>
        <h3>Vote Count</h3>
        <ul>
          {sortedVoteCounts.map((voteCount) => (
            <li key={voteCount.commentId}>
              {/* link similar to https://github.com/facebook/react/issues/13525#issuecomment-417778052  */}
              <a
                href={`${currentURL}#${voteCount.commentId}`}
                onClick={() => scrollToComment(voteCount.commentId)}
              >
                {voteCount.commentId} - {voteCount.voteCount}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root')
)
