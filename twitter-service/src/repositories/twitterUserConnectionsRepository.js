'use strict'
const makeObjectId = require('../helpers/makeObjectId')

const twitterUserConnectionsRepository = container => {
  const { database: db, models } = container.cradle
  const collection = db.collection('twitter_user_connections')

  const disconnect = () => db.close()

  async function createTwitterUserConnections(data) {
    const model = await models.validate(data, 'twitterUserConnections')
    const $insert = await models.toDocument(model, 'twitterUserConnections')

    await collection.insertOne($insert)
  }

  return Object.assign({}, {
    disconnect,
    createTwitterUserConnections,
  })
}

const connect = container => {
  return new Promise((resolve, reject) => {
    const db = container.resolve('database')

    if (!db) {
      reject(new Error('connection db not supplied!'))
    }

    resolve(twitterUserConnectionsRepository(container))
  })
}

module.exports = Object.assign({connect})
