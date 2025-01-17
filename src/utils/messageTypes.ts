export const messageTypes = {
  getHighestVotes: 'getHighestVotes',
  scrollToComment: 'scrollToComment',
  alert: 'alert',

  redirectToUrl: 'redirectToUrl',

  initReactApp: 'initReactApp',
  foundResource: 'foundResource',
  hideRelearnButton: 'hideRelearnButton',

  toggleLinkScan: 'toggleLinkScan',
  checkAndOpenResourceModal: 'checkAndOpenResourceModal',
  openResourceModal: 'openResourceModal',

  openLoadingModal: 'openLoadingModal',
  closeLoadingModal: 'closeLoadingModal',

  startTimer: 'startTimer',
  cancelTimer: 'cancelTimer',
  getRemainingMs: 'getRemainingMs',
} as const
