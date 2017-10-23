const {
  serverSettings,
  serviceEndpoints,
  encryptedAccessSecret
}                 = require('./config')
const services    = require('../services')
const di          = require('./di')
const middleware  = require('../middleware')

const init = di.initDI.bind(null, {
  serverSettings,
  serviceEndpoints,
  encryptedAccessSecret,
  services,
  middleware
})

module.exports = Object.assign({}, { init })
