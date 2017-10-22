const express    = require('express')
const logger     = require('morgan')
const helmet     = require('helmet')
const bodyParser = require('body-parser')
const path       = require('path')
const api        = require('../api')
const proxy      = require('http-proxy-middleware')

const handleUnknownRoutes = (req, res) => {
  res.status(404).send();
};

const start = (container) => {
  return new Promise((resolve, reject) => {
    const { gatewayRepository, serverSettings, routes } = container.cradle

    if (!gatewayRepository) {
      return reject(new Error('The server must be started with a connected repository'))
    }

    if (!serverSettings.port) {
      return reject(new Error('The server must be started with an available port'))
    }

    if (!routes) {
      return reject(new Error('The server must be started with routes discovered'))
    }

    const app = express()
    app.use(logger('dev'))
    app.use(helmet())
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(express.static('public'))
    app.use(express.static(path.join(__dirname, 'public')))

    // Configure the api
    api(app, gatewayRepository);

    for (let id of Reflect.ownKeys(routes)) {
      const { route, target } = routes[id]

      const pathRewrite = {}
      const rewriteKey = `^${route}`
      pathRewrite[rewriteKey] = ''

      app.use(route, proxy({
        target,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite
      }))
    }

    // Handles all routes so you do not get a not found error
    app.get('*', handleUnknownRoutes);

    const server = app.listen(serverSettings.port, () => resolve(server))
  })
}

module.exports = Object.assign({}, {start})
