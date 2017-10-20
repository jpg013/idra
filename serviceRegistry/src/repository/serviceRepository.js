'use strict'
const co = require('co')

const serviceRepository = container => {
  const {database: db} = container.cradle
  const models = container.resolve('models')
  const servicesCollection = db.collection('services')

  const getRegisteredServices = ($query={}) => {
    return co(function *() {
      const resp = yield servicesCollection.find($query).toArray()
      if (resp) {
        return yield Promise.all(resp.map(cur => models.fromDocument(cur, 'serviceRegistry')))
      }
    })
  }

  const registerService = service => {
    const { containerName, containerPort } = service

    if (!containerName || !containerPort) {
      return Promise.reject('Bad request data.')
    }

    return co(function*() {
      const modelPromises = service.endpoints.map(cur => {
        const data = {
          containerName,
          containerPort,
          serviceKey: `${cur.method}:${cur.originUrl}`,
          ...cur
        }
        return models.validate(data, 'serviceRegistry')
      })

      const modelsResp = yield Promise.all(modelPromises)

      const updatePromises = modelsResp.map(cur => {
        const $opts = { upsert: true, w: 1 }
        const $update = { $set: { ...cur } }
        const $query = {serviceKey: cur.serviceKey}
        return servicesCollection.updateOne($query, $update, $opts)
      })

      const resp = yield Promise.all(updatePromises)
    })
  }

  const disconnect = () => db.close()

  return Object.create({
    getRegisteredServices,
    registerService,
    disconnect
  })
}

const connect = container => {
  return new Promise((resolve, reject) => {
    const db = container.resolve('database');

    if (!db) {
      reject(new Error('connection db not supplied!'))
    }

    resolve(serviceRepository(container))
  })
}

module.exports = Object.assign({}, {connect})
