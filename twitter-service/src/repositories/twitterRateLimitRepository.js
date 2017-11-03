'use strict'

const twitterRateLimitRepository = container => {
  const { database: db, models } = container.cradle
  const collection = db.collection('twitter_rate_limits')
  const disconnect = () => db.close()

  async function upsertRateLimit(rateLimit) {
    const $update = await models.validate(rateLimit, 'twitterRateLimit')
    const $query = { applicationToken: rateLimit.applicationToken }
    const $opts = { upsert: true }

    return await collection.updateOne($query, $update, $opts)
  }

  async function secureRateLimit(type, applicationToken) {
    const $query = { applicationToken }
    const remainingKey = `${type}.remaining`
    $query[remainingKey] = { $gte: 1 }

    const $update = { $inc: {} }
    $update.$inc[remainingKey] = -1

    const { result } = await collection.updateOne($query, $update)

    return result.n === 1 && result.nModified === 1 && result.ok === 1
  }

  async function getRateLimitReset(type, applicationToken) {
    const $query = { applicationToken }
    const result = await collection.findOne($query)

    return result ? result[type].reset : result
  }

  async function getRateLimitForApplication(type, applicationToken) {
    const $query = { applicationToken }

    const objData = await collection.findOne($query)
    const model = await models.fromDocument(objData, 'twitterRateLimit')

    return model
  }

  return Object.create({
    disconnect,
    secureRateLimit,
    upsertRateLimit,
    getRateLimitForApplication,
    getRateLimitReset
  })
}

const connect = container => {
  return new Promise((resolve, reject) => {
    const db = container.resolve('database')

    if (!db) {
      reject(new Error('connection db not supplied!'))
    }

    resolve(twitterRateLimitRepository(container))
  })
}

module.exports = Object.create({connect})
