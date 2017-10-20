const { dbSettings, serverSettings } = require('./config')
const database                       = require('./db')
const di                             = require('./di')
const models                         = require('../models')

const init = di.initDI.bind(null, { serverSettings, dbSettings, database, models})

module.exports = Object.assign({}, { init })
