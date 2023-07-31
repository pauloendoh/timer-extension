import { ResourceDto } from '../../../types/domains/resources/ResourceDto'
import { getSync, setSync } from '../../../utils/chromeStoragePromises'
import { messageTypes } from '../../../utils/messageTypes'
import myAxios from '../../../utils/myAxios'
import { syncKeys } from '../../../utils/syncKeys'
import { urls } from '../../../utils/urls'

export async function content_toggleLinkScan(tabId: string) {
  window.dispatchEvent(new CustomEvent(messageTypes.openLoadingModal))

  const currentValue = await getSync<boolean>(syncKeys.linkScan(tabId))

  const newValue = !currentValue
  await setSync(syncKeys.linkScan(tabId), newValue)

  if (!newValue) {
    removeSpans()
    closeLoadingModal()
    return
  }

  const links = document.querySelectorAll('a')
  const hrefs = Array.from(links).map((link) => link.href)

  const data = await myAxios
    .post<
      {
        url: string
        resource: ResourceDto | null
      }[]
    >(urls.api.relearn.scanUrls, {
      urls: hrefs,
    })
    .then((res) => res.data)

  links.forEach((link) => {
    if (!link.href) {
      return
    }
    const found = data.find((d) => d.url === link.href)
    const foundValue = found?.resource?.rating
    const isSaved = found && foundValue === null

    // add a flating text span to the link top right corner
    const span = document.createElement('span')
    span.innerText = '?'
    span.style.display = 'inline-block'
    span.style.position = 'absolute'
    span.style.top = '0'

    // after the link
    span.style.left = '100%'
    span.style.marginLeft = '4px'

    span.style.backgroundColor = 'red'
    span.style.color = 'white'
    span.style.paddingInline = '4px'
    span.style.paddingBlock = '2px'
    span.style.fontSize = '10px'
    span.style.borderRadius = '2px'
    span.style.zIndex = '99'
    span.style.borderRadius = '2px'
    span.classList.add('relearn-link-scan')
    link.style.position = 'relative'

    if (isSaved) {
      // bookmark icon
      span.innerText = 'Saved'
      span.style.backgroundColor = 'gray'
    }

    if (foundValue) {
      span.innerText = `${foundValue}/5`
      span.style.backgroundColor = '#bf8500'
    }

    link.appendChild(span)
  })
  closeLoadingModal()
}

function removeSpans() {
  const spans = document.querySelectorAll('.relearn-link-scan')
  spans.forEach((span) => {
    span.remove()
  })
}

function closeLoadingModal() {
  window.dispatchEvent(new CustomEvent(messageTypes.closeLoadingModal))
}
