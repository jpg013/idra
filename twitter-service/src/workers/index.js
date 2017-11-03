const connectJobRunner                    = require('./jobRunner')
const connectSetupJob                     = require('./setupJob')
const connectRefreshRateLimit             = require('./refreshRateLimit')
const connectGetTwitterUserFriends        = require('./getTwitterUserFriends')
const connectGetTwitterUserFollowers      = require('./getTwitterUserFollowers')
const connectWaitForAvailableRateLimit    = require('./waitForAvailableRateLimit')
const connectCreateTwitterUserConnections = require('./createTwitterUserConnections')

const connect = container => {
  const workers = {
    jobRunner: connectJobRunner(container),
    setupJob: connectSetupJob(container),
    refreshRateLimit: connectRefreshRateLimit(container),
    getTwitterUserFriends: connectGetTwitterUserFriends(container),
    getTwitterUserFollowers: connectGetTwitterUserFollowers(container),
    waitForAvailableRateLimit: connectWaitForAvailableRateLimit(container),
    createTwitterUserConnections: connectCreateTwitterUserConnections(container)
  }

  return new Promise(resolve => {
    container.registerValue({workers})
    resolve(container)
  })
}

module.exports = connect
