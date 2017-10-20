'use strict'
const co = require('co')

const userRepository = container => {
  const {database: db} = container.cradle
  const models = container.resolve('models')
  const usersCollection = db.collection('users')

  const findByUsername = userName => {
    return co(function *() {
      const resp = yield usersCollection.findOne({userName})
      if (resp) {
        return yield models.fromDocument(resp, 'user')
      }
    })
  }

  const disconnect = () => {
    db.close()
  }

  return Object.create({
    findByUsername,
    disconnect
  })
}

const connect = container => {
  return new Promise((resolve, reject) => {
    const db = container.resolve('database');

    if (!db) {
      reject(new Error('connection db not supplied!'))
    }

    resolve(userRepository(container))
  })
}

module.exports = Object.assign({}, {connect})
