const { createContainer, asValue } = require('awilix')

function initDI ({serverSettings, serviceEndpoints, encryptedAccessSecret, services}, mediator) {
  mediator.once('init', () => {
    mediator.on('boot.ready', (db) => {
      const container = createContainer()

      container.register({
        serverSettings: asValue(serverSettings),
        serviceEndpoints: asValue(serviceEndpoints),
        encryptedAccessSecret: asValue(encryptedAccessSecret)
      })

      container.register('services', asValue(services(container)))

      mediator.emit('di.ready', container)
    })

    mediator.on('db.error', (err) => {
      mediator.emit('di.error', err)
    })

    mediator.emit('boot.ready')
  })
}

module.exports.initDI = initDI
