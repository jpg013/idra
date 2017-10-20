const dial = require('../libs/dial')

const users = container => {
  const registry = container.resolve('registry')


  const register = () => {
    const url = `http://${process.env.SERVICE_REGISTRY_CONTAINER_NAME}:${process.env.SERVICE_REGISTRY_CONTAINER_PORT}/registry`;
    const opts = { json: { service: registry } }

    dial(url, 'put', opts)
  }

  return Object.create({
    register
  })
}

module.exports = serviceRegistry;
