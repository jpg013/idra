const connectJobRunner                    = require('./jobRunner')
const connectSetupJob                     = require('./setupJob')
const connectRefreshRateLimit             = require('./refreshRateLimit')
const connectGetTwitterUserFriends        = require('./getTwitterUserFriends')
const connectGetTwitterUserFollowers      = require('./getTwitterUserFollowers')
const connectWaitForAvailableRateLimit    = require('./waitForAvailableRateLimit')
const connectCreateTwitterUserConnections = require('./createTwitterUserConnections')
const connectCleanupJob                   = require('./cleanupJob')

const connect = container => {
  const workers = {
    jobRunner: connectJobRunner(container),
    setupJob: connectSetupJob(container),
    refreshRateLimit: connectRefreshRateLimit(container),
    getTwitterUserFriends: connectGetTwitterUserFriends(container),
    getTwitterUserFollowers: connectGetTwitterUserFollowers(container),
    waitForAvailableRateLimit: connectWaitForAvailableRateLimit(container),
    createTwitterUserConnections: connectCreateTwitterUserConnections(container),
    cleanupJob: connectCleanupJob(container)
  }

  return new Promise(resolve => {
    container.registerValue({workers})
    resolve(container)
  })
}

module.exports = connect
