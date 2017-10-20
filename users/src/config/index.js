const { dbSettings, serverSettings } = require('./config')
const database                       = require('./db')
const di                             = require('./di')
const models                         = require('../models')
const registry                       = require('./registry')
const services                       = require('../services')


const init = di.initDI.bind(null, { serverSettings, dbSettings, database, models, registry, services})

module.exports = Object.assign({}, { init })
