const parseRequestBearerToken   = require('./parseRequestBearerToken')
const ensureUserAuthenticated   = require('./ensureUserAuthenticated')
const populateAuthenticatedUser = require('./populateAuthenticatedUser')
const logGatewayRequest         = require('./logGatewayRequest')
const makeApiProxy              = require('./makeApiProxy')

module.exports = container => {
  return Object.create({
    parseRequestBearerToken: parseRequestBearerToken(container),
    ensureUserAuthenticated: ensureUserAuthenticated(container),
    populateAuthenticatedUser: populateAuthenticatedUser(container),
    logGatewayRequest: logGatewayRequest(container),
    makeApiProxy: makeApiProxy(container)
  })
}
