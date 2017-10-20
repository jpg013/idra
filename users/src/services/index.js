const serviceRegistry = require('./serviceRegistry')

const config = container => {
  return {
    serviceRegistry: serviceRegistry(container)
  }
}

module.exports = config
