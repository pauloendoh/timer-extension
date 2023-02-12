import { useAxios } from '../../hooks/useAxios'
import { urls } from '../../utils/urls'

export const handleRelearnResource = async (tab: chrome.tabs.Tab) => {
  const url = tab.url
  if (!url) return

  console.log('XD')
  const axios = useAxios()
  axios.get(urls.api.alreadySavedResource(url)).then((res) => {
    console.log(res)
  })
  console.log('handling tab')
  // update badge
  chrome.action.setBadgeText({
    tabId: tab.id,
    text: '...',
  })
}
