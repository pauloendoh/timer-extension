import { AlreadyRatedResourceDto } from '../../../types/domains/resources/AlreadyRatedResourceDto'
import { buildResourceDto } from '../../../types/domains/resources/ResourceDto'
import { messageTypes } from '../../../utils/messageTypes'
import myAxios from '../../../utils/myAxios'
import { urls } from '../../../utils/urls'

export const content_checkAndOpenResourceModal = async (url: string) => {
  window.dispatchEvent(new CustomEvent(messageTypes.openLoadingModal))

  const data = await myAxios
    .get<AlreadyRatedResourceDto>(urls.api.alreadySavedResource(url))
    .then((res) => res.data)

  if (data.resource) {
    window.dispatchEvent(
      new CustomEvent(messageTypes.openResourceModal, {
        detail: {
          resource: data.resource,
        },
      })
    )
    window.dispatchEvent(new CustomEvent(messageTypes.closeLoadingModal))
    return
  }

  const linkPreview = await myAxios
    .get(urls.api.linkPreview(url))
    .then((res) => res.data)

  const resource = buildResourceDto({
    url,
    thumbnail: linkPreview.thumbnail,
    title: linkPreview.title,
  })

  window.dispatchEvent(new CustomEvent(messageTypes.closeLoadingModal))

  window.dispatchEvent(
    new CustomEvent(messageTypes.openResourceModal, {
      detail: {
        resource,
      },
    })
  )
}
