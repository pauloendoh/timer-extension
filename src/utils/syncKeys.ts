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

  // link scan
  linkScan: (tabId: string) => 'linkScan/' + tabId,
}
