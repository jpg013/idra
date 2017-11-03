const {
  dbSettings,
  serverSettings,
  neo4jCredentials
} = require('./config')
const database              = require('./db')
const di                    = require('./di')
const models                = require('../models')

const bindArgs = {
  serverSettings,
  dbSettings,
  database,
  neo4jCredentials,
  models
}

const init = di.initDI.bind(null, bindArgs);

module.exports = Object.assign({}, { init });
