import { AlreadyRatedResourceDto } from '../../types/domains/resources/AlreadyRatedResourceDto'
import { messageTypes } from '../../utils/messageTypes'
import { myFetch } from '../../utils/myFetch'
import { urls } from '../../utils/urls'

let loadingUrls: string[] = []

export const handleRelearnResource = async (tab: chrome.tabs.Tab) => {
  const url = tab.url
  if (!url) return

  if (loadingUrls.includes(url)) return

  loadingUrls.push(url)
  myFetch(urls.api.alreadySavedResource(url))
    .then((res) => res.json())
    .then((data: AlreadyRatedResourceDto) => {
      if (!tab.id) return

      console.log({
        data,
      })
      if (data.resource) {
        // send message
        chrome.tabs.sendMessage(tab.id, {
          type: messageTypes.handleResource,
          resource: data.resource,
          tabId: tab.id,
        })

        return
      }

      chrome.tabs.sendMessage(tab.id, {
        type: messageTypes.hideRelearnButton,
      })
    })
    .finally(() => {
      loadingUrls = loadingUrls.filter((u) => u !== url)
    })
}
