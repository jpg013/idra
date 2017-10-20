const dial                       = require('../libs/dial')
const makeAccessSecretQueryParam = require('../helpers/makeAccessSecretQueryParam')

const makeRoutes = ({ registeredServices }) => {
  const routes = new Proxy({}, {
    get (target, key) {
      console.log(`Get properties from -> "${key}" container`)
      return Reflect.get(target, key)
    },
    set (target, key, value) {
      console.log('Setting properties', key, value)
      return Reflect.set(target, key, value)
    }
  })

  registeredServices.forEach(cur => {
    const { containerName, containerPort, endpoint, originUrl, serviceKey } = cur
    const details = {
      target: `http://${containerName}:${containerPort}/${endpoint}`,
      route: originUrl
    }
    routes[serviceKey] = details
  })
  return routes
}

const discoverRoutes = container => {
  const serviceEndpoints = container.resolve('serviceEndpoints')
  const encryptedAccessSecret = container.resolve('encryptedAccessSecret')

  return () => {
    const url = `${serviceEndpoints.serviceRegistry}/registry`
    const opts = { queryParams: { access_secret:  encryptedAccessSecret } }

    return dial(url, 'get', opts)
      .then(makeRoutes)
  }
}

module.exports = discoverRoutes
