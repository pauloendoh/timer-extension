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
    remainingMs: 'timer.remainingMs',
    isRinging: 'timer.isRinging',
    interval: 'timer.interval',
  },

  // link scan
  linkScan: (tabId: string) => 'linkScan/' + tabId,
}
