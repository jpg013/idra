'use strict'

const { EventEmitter }          = require('events')
const server                    = require('./server/server')
const serviceRepository         = require('./repository/serviceRepository')
const config                    = require('./config')
const mediator                  = new EventEmitter()
const winston                   = require('winston');

winston.log('info', '--- Service Registry ---');
winston.log('info', 'Connecting to service registry repository...')

process.on('uncaughtException', (err) => {
  winston.log('error', 'Unhandled Exception', err)
})

process.on('uncaughtRejection', (err, promise) => {
  winston.log('error', 'Unhandled Rejection', err)
})

mediator.on('di.ready', (container) => {
  serviceRepository.connect(container)
    .then(repo => {
      winston.log('info', 'Connected to repository. Starting Server')
      container.registerValue({serviceRepository: repo})
      return server.start(container)
    })
    .then(app => {
      winston.log('info', `Server started succesfully, running on port: ${container.cradle.serverSettings.port}.`)

      app.on('close', () => {
        container.resolve('serviceRepository').disconnect()
      })
    })
    .catch(e => {
      winston.log('error', e)
    })
})

config.init(mediator)

mediator.emit('init')
