const discoverRoutes = require('./discoverRoutes')
// const users           = require('./users')

const config = container => {
  return {
    discoverRoutes: discoverRoutes(container)
    // users: users(container)
  }
}

module.exports = config
