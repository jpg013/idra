'use strict'

const { EventEmitter } = require('events')
const server           = require('./server/server')
const configRepos      = require('./repositories')
const config           = require('./config')
const mediator         = new EventEmitter()

console.log('--- Institutions Service ---')
console.log('Connecting to institution repository...')

process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception', err)
})

process.on('uncaughtRejection', (err, promise) => {
  console.error('Unhandled Rejection', err)
})

mediator.on('di.ready', (container) => {
  configRepos(container)
    .then(repositories => {
      console.log('Connected to repositories. Starting Server')
      container.registerValue({repositories})
      return server.start(container)
    })
    .then(app => {
      console.log(`Server started succesfully, running on port: ${container.cradle.serverSettings.port}.`)

      const { serviceRegistry } = container.resolve('services')
      serviceRegistry.register()

      app.on('close', () => {
        container.resolve('userRepository').disconnect()
      })
    })
    .catch(e => {
      console.log(e)
    })
})

config.init(mediator)

mediator.emit('init')
