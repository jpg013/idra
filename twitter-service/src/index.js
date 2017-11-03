'use strict'

const { EventEmitter }          = require('events')
const server                    = require('./server/server')
const connectRepositories       = require('./repositories/')
const config                    = require('./config')
const mediator                  = new EventEmitter()
const winston                   = require('winston')
const connectJobScheduler       = require('./jobScheduler')
const connectServices           = require('./services')
const connectWorkers            = require('./workers')

winston.log('info', '--- Twitter Service ---');

process.on('uncaughtException', (err) => {
  winston.log('error', 'Unhandled Exception', err)
})

process.on('uncaughtRejection', (err, promise) => {
  winston.log('error', 'Unhandled Rejection', err)
})

async function onDependencyInjectionReady(container) {
  try {
    container.registerValue({repositories: await connectRepositories(container)})
    winston.log('info', 'Connected to repositories')

    container.registerValue({services: await connectServices(container)})
    winston.log('info', 'Connected to services')

    container = await connectWorkers(container)
    winston.log('info', 'Connected to workers')

    container = await connectJobScheduler(container)
    winston.log('info', 'Connected to job scheduler. Starting server')

    const app = await server.start(container)

    winston.log('info', `Server started succesfully, running on port: ${container.cradle.serverSettings.port}.`)

    app.on('close', () => {
      const repositories = container.resolve('repositories')
      Object.keys(repositories).forEach(cur => repositories[cur].disconnect())
    })

    winston.log('info', 'Restarting active twitter jobs')
    const { rebootRunningJobs } = container.resolve('jobScheduler')
    rebootRunningJobs()
  } catch(e) {
    winston.log('error', e)
  }
}

mediator.on('di.ready', onDependencyInjectionReady)

config.init(mediator)

mediator.emit('init')
