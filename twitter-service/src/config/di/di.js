const { createContainer, asValue } = require('awilix')

function initDI ({
  serverSettings,
  dbSettings,
  database,
  neo4jCredentials,
  models,
}, mediator) {

  mediator.once('init', () => {
    mediator.on('db.ready', (db) => {
      const container = createContainer()

      container.register({
        database: asValue(db),
        models: asValue(models),
        ObjectID: asValue(database.ObjectID),
        neo4jCredentials: asValue(neo4jCredentials),
        serverSettings: asValue(serverSettings),
      })

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
