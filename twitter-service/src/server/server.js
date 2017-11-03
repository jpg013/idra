const express    = require('express')
const logger     = require('morgan')
const helmet     = require('helmet')
const bodyParser = require('body-parser')
const path       = require('path')
const api        = require('../api')

const handleUnknownRoutes = (req, res) => {
  res.status(404).send();
};

const start = (container) => {
  return new Promise((resolve, reject) => {
    const { serverSettings } = container.cradle

    if (!serverSettings.port) {
      return reject(new Error('The server must be started with an available port'))
    }

    const app = express()
    app.use(logger('dev'))
    app.use(helmet())
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(express.static('public'))
    app.use(express.static(path.join(__dirname, 'public')))

    // Configure the api
    api(app, container)

    // Handles all routes so you do not get a not found error
    app.get('*', handleUnknownRoutes)

    const server = app.listen(serverSettings.port, () => resolve(server))
  })
}

module.exports = Object.assign({}, { start })
