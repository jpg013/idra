const serviceRegistry = require('./serviceRegistry')

const services = [serviceRegistry]

const config = container => {
  return {
    serviceRegistry: serviceRegistry(container)
  }
}

module.exports = config
