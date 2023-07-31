import { IRedirectItem } from '../../types/domains/redirect/IRedirectItem'
import { getSync } from '../../utils/chromeStoragePromises'
import { syncKeys } from '../../utils/syncKeys'

export const bgHandleRedirectTab = async (tab: chrome.tabs.Tab) => {
  const redirectItems = await getSync<IRedirectItem[]>(
    syncKeys.siteRedirect.redirectItems
  )

  const isActive = await getSync<boolean>(syncKeys.siteRedirect.isActive)
  if (!isActive) return

  if (!redirectItems) return

  const url = tab.url
  if (!url) return

  const redirectItem = redirectItems.find((item) =>
    url.includes(item.urlIncludes)
  )

  if (redirectItem && tab.id) {
    // redirect tab to url
    chrome.tabs.update(tab.id, { url: redirectItem.redirectTo })
  }
}
