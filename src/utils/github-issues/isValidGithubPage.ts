export const isValidGithubPage = (url: string) => {
  return (
    url.includes('github.com') &&
    (url.includes('/issues/') || url.includes('/discussions/'))
  )
}
