const MongoClient      = require('mongodb')
const setupCollections = require('./setupCollections')
const insertRootJob    = require('./insertRootJob')
const insertRootTwitterCredentials = require('./insertRootTwitterCredentials')

const getMongoURL = (options) => `mongodb://${options.server}/${options.db}`

const connect = (options, mediator) => {
  mediator.once('boot.ready', () => {
    const mongoOptions = {
      ...options.dbParameters,
      ...options.serverParameters,
    }
    console.log('attempting to connect to mongo client with options, ',options)
    console.log(getMongoURL(options))
    MongoClient.connect(getMongoURL(options), mongoOptions, (err, db) => {
      console.log(err)
      if (err) {
        return mediator.emit('db.error', err)
      }

      setupCollections(db, options, err => {
        if (err) {
          return mediator.emit('db.error', err)
        }

        insertRootTwitterCredentials(db, (err) => {
          if (err) {
            return mediator.emit('db.error', err)
          }
          insertRootJob(db, err => {
            if (err) {
              return mediator.emit('db.error', err)
            }
            mediator.emit('db.ready', db)
          })
        })
      })
    })
  })
}

module.exports = Object.assign({}, { connect })
