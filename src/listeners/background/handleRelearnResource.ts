import { AlreadyRatedResourceDto } from '../../types/domains/resources/AlreadyRatedResourceDto'
import { myFetch } from '../../utils/myFetch'
import { urls } from '../../utils/urls'

export const handleRelearnResource = async (tab: chrome.tabs.Tab) => {
  const url = tab.url
  if (!url) return

  console.log('XD')
  myFetch(urls.api.alreadySavedResource(url))
    .then((res) => res.json())
    .then((data: AlreadyRatedResourceDto) => {
      if (data.resource) {
        chrome.action.setBadgeBackgroundColor({
          tabId: tab.id,
          color: 'yellow',
        })

        if (data.resource.rating) {
          chrome.action.setBadgeText({
            tabId: tab.id,
            text: data.resource.rating.toString(),
          })
          return
        }

        chrome.action.setBadgeText({
          tabId: tab.id,
          text: '🤔',
        })
      }
    })
}
