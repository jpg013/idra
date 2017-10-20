const joi             = require('joi')
const serviceRegistry = require('./serviceRegistry.model')(joi)

const models = Object.create({
  serviceRegistry
})

const schemaValidator = (object, type) => {
  return new Promise((resolve, reject) => {
    if (!object) {
      return reject (new Error('object to validate not provided'))
    }

    if (!type) {
      return reject (new Error('schema type to validate not provided'))
    }

    const validator = models[type].validate.bind(null, object);

    const { error, value } = validator()

    resolve(value);
  });
}

const fromDocument = (object, type) => {
  return new Promise(function(resolve, reject) {
    if (!object) {
      return reject (new Error('object to validate not provided'))
    }

    if (!type) {
      return reject (new Error('schema type to validate not provided'))
    }

    const validator = models[type].fromDocument.bind(null, object);

    const { error, value } = validator()

    if (error) {
      return reject(new Error(`invalid ${type} data, err: ${error}`))
    }

    resolve(value);
  });
}

const toDocument = (object, type) => {
  return new new Promise(function(resolve, reject) {
    if (!object) {
      reject (new Error('object to validate not provided'))
    }

    if (!type) {
      reject (new Error('schema type to validate not provided'))
    }

    const validator = models[type].toDocument.bind(null, object);

    const {error, value} = validator()

    if (error) {
      reject(new Error(`invalid ${type} data, err: ${error}`))
    }

    resolve(value);
  });
}

module.exports = Object.create({
  validate: schemaValidator,
  fromDocument,
  toDocument
})
