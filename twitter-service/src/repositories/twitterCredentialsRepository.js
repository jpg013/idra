'use strict'
const makeObjectId = require('../helpers/makeObjectId')

const twitterCredentialsRespository = container => {
  const { database: db, models } = container.cradle
  const collection = db.collection('twitter_credentials')

  const disconnect = () => db.close()

  async function getTwitterCredentialsForInstitution(institutionID) {
    return await collection.findOne({institutionID})
  }

  return Object.create({
    disconnect,
    getTwitterCredentialsForInstitution
  })
}

const connect = container => {
  return new Promise((resolve, reject) => {
    const db = container.resolve('database')

    if (!db) {
      reject(new Error('connection db not supplied!'))
    }

    resolve(twitterCredentialsRespository(container))
  })
}

module.exports = Object.create({connect})
