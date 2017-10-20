const { serverSettings, serviceEndpoints, encryptedAccessSecret } = require('./config')
const services = require('../services')
const di       = require('./di')

const init = di.initDI.bind(null, { serverSettings, serviceEndpoints, encryptedAccessSecret, services })

module.exports = Object.assign({}, { init })
