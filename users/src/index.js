'use strict'

const { EventEmitter } = require('events')
const server           = require('./server/server')
const userRepo         = require('./repos/userRepository')
const config           = require('./config')
const mediator         = new EventEmitter()

console.log('--- Users Service ---')
console.log('Connecting to user repository...')

process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception', err)
})

process.on('uncaughtRejection', (err, promise) => {
  console.error('Unhandled Rejection', err)
})

mediator.on('di.ready', (container) => {
  userRepo.connect(container)
    .then(userRepository => {
      console.log('Connected to repository. Starting Server')
      container.registerValue({userRepository})
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
