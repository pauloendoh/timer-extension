const isLocal = false

const relearn = isLocal
  ? 'http://localhost:3000'
  : 'https://endohio-server.herokuapp.com'

export const urls = {
  api: {
    auth: {
      login: relearn + '/auth/login',
    },
    alreadySavedResource: (url: string) =>
      relearn + `/already-saved-resource?url=${encodeURIComponent(url)}`,
    linkPreview: (url: string) =>
      relearn + `/utils/link-preview?url=${encodeURIComponent(url)}`,
    relearn: {
      resource: relearn + '/relearn/resource?returnAll=false',
      scanUrls: relearn + '/scan-urls',
    },
  },
}
