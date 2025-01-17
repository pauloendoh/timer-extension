export const syncKeys = {
  // github issues
  voteCounts: 'voteCounts',
  user: 'user',
  issues: 'issues',

  // site redirect
  siteRedirect: {
    isActive: 'siteRedirect.isActive',
    redirectItems: 'siteRedirect.redirectItems',
  },

  timer: {
    minutesInput: 'timer.minutesInput',
    secondsInput: 'timer.secondsInput',
  },

  // link scan
  linkScan: (tabId: string) => 'linkScan/' + tabId,
}
