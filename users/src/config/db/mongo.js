const MongoClient = require('mongodb')
const setupCollections = require('./setupCollections')
const addRootUser      = require('./scripts/addRootUser');

const getMongoURL = (options) => `mongodb://${options.server}/${options.db}`

const connect = (options, mediator) => {
  mediator.once('boot.ready', () => {
    const mongoOptions = {
      ...options.dbParameters,
      ...options.serverParameters,
    }

    MongoClient.connect(getMongoURL(options), mongoOptions, (err, db) => {
      if (err) {
        return mediator.emit('db.error', err)
      }
      setupCollections(db, options, err => {
        if (err) {
          return mediator.emit('db.error', err)
        }

        addRootUser(db, addRootUserErr => {
          if (err) {
            return mediator.emit('db.error', addRootUserErr)
          }
          mediator.emit('db.ready', db)
        })
      })
    })
  })
}

module.exports = Object.assign({}, { connect })
