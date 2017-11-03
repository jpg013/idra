const joi                    = require('joi')
const twitterJob             = require('./twitterJob.model')
const twitterUserConnections = require('./twitterUserConnections.model')
const twitterRateLimit       = require('./twitterRateLimit.model')

const models = Object.create({
  twitterJob: twitterJob(joi),
  twitterUserConnections: twitterUserConnections(joi),
  twitterRateLimit: twitterRateLimit(joi)
})

const schemaValidator = (object, type) => {
  return new Promise((resolve, reject) => {
    if (!object) {
      return reject (new Error('object to validate not provided'))
    }

    if (!type) {
      return reject (new Error('schema type to validate not provided'))
    }

    const validator = models[type].validate.bind(null, object)

    const { error, value } = validator()

    resolve(value)
  })
}

const fromDocument = (object, type) => {
  return new Promise(function(resolve, reject) {
    if (!object) {
      return reject (new Error('object to validate not provided'))
    }

    if (!type) {
      return reject (new Error('schema type to validate not provided'))
    }

    const validator = models[type].fromDocument.bind(null, object)

    const { error, value } = validator()

    if (error) {
      return reject(new Error(`invalid ${type} data, err: ${error}`))
    }

    resolve(value)
  })
}

const toDocument = (object, type) => {
  return new Promise(function(resolve, reject) {
    if (!object) {
      return reject (new Error('object to validate not provided'))
    }

    if (!type) {
      return reject (new Error('schema type to validate not provided'))
    }

    const validator = models[type].toDocument.bind(null, object)

    const {error, value} = validator()

    if (error) {
      return reject(new Error(`invalid ${type} data, err: ${error}`))
    }

    resolve(value)
  })
}

module.exports = Object.create({
  validate: schemaValidator,
  fromDocument,
  toDocument
})
