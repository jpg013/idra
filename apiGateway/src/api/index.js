const express                  = require('express')
const authenticationController = require('./controllers/authenticationController')

const config = (app, container) => {
  const gatewayRouter = express.Router()

  const { routes } = container.cradle
  
  if (!routes) {
    return reject(new Error('The server must be started with registered routes'))
  }

  const {
    parseRequestBearerToken,
    populateAuthenticatedUser,
    logGatewayRequest,
    ensureUserAuthenticated,
    makeApiProxy
   } = container.resolve('middleware')

  gatewayRouter.use(parseRequestBearerToken, populateAuthenticatedUser, logGatewayRequest)

  // ======================================================
  // Mount the controllers to routes
  // ======================================================
  gatewayRouter.use('/authentication', authenticationController(container))

  // ======================================================
  // Mount the router to the app and return app
  // ======================================================
  app.use('/api', gatewayRouter);
   
  // ======================================================
  // Everything else requires user to be authenticated
  // ======================================================
  app.use(ensureUserAuthenticated)

  for (let id of Reflect.ownKeys(routes)) {
    const { route, target, routePermissions } = routes[id]
    const apiProxy = makeApiProxy(route, target, routePermissions)

    app.use(`api/${route}`, apiProxy)
  }
  return app;
};

module.exports = config;
