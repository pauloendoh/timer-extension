const relearn = 'https://endohio-server.herokuapp.com'

export const urls = {
  api: {
    auth: {
      login: relearn + '/auth/login',
    },
    alreadySavedResource: (url: string) =>
      relearn + `/already-saved-resource?url=${encodeURIComponent(url)}`,
  },
}
