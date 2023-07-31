export const messageTypes = {
  getHighestVotes: 'getHighestVotes',
  scrollToComment: 'scrollToComment',
  alert: 'alert',

  redirectToUrl: 'redirectToUrl',

  // PE 1/3 - improve name?
  initReactApp: 'initReactApp',
  foundResource: 'foundResource',
  hideRelearnButton: 'hideRelearnButton',

  toggleLinkScan: 'toggleLinkScan',
  saveCurrentPage: 'saveCurrentPage',
  openResourceModal: 'openResourceModal',

  openLoadingModal: 'openLoadingModal',
  closeLoadingModal: 'closeLoadingModal',
} as const
