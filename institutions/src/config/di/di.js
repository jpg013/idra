const { createContainer, asValue } = require('awilix')

function initDI ({serverSettings, dbSettings, database, models, registry, services}, mediator) {
  mediator.once('init', () => {
    mediator.on('db.ready', (db) => {
      const container = createContainer()

      container.register({
        database: asValue(db),
        models: asValue(models),
        ObjectID: asValue(database.ObjectID),
        serverSettings: asValue(serverSettings),
        registry: asValue(registry),
      })

      container.register('services', asValue(services(container)))

      mediator.emit('di.ready', container)
    })

    mediator.on('db.error', (err) => {
      mediator.emit('di.error', err)
    })

    database.connect(dbSettings, mediator)

    mediator.emit('boot.ready')
  })
}

module.exports.initDI = initDI
