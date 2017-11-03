'use strict'
const co = require('co')

const institutionRepository = container => {
  const {database: db} = container.cradle
  const models = container.resolve('models')
  const institutionsCollection = db.collection('institutions')


  const disconnect = () => {
    db.close()
  }

  return Object.create({
    disconnect
  })
}

const connect = container => {
  return new Promise((resolve, reject) => {
    const db = container.resolve('database');

    if (!db) {
      reject(new Error('connection db not supplied!'))
    }

    resolve(institutionRepository(container))
  })
}

module.exports = Object.assign({}, {connect})
