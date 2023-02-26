import { AlreadyRatedResourceDto } from '../../types/domains/resources/AlreadyRatedResourceDto'
import { messageTypes } from '../../utils/messageTypes'
import { myFetch } from '../../utils/myFetch'
import { urls } from '../../utils/urls'

export const handleRelearnResource = async (tab: chrome.tabs.Tab) => {
  const url = tab.url
  if (!url) return

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
        })

        return
      }

      chrome.tabs.sendMessage(tab.id, {
        type: messageTypes.hideRelearnButton,
      })
    })
}
