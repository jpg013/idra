'use strict'

const gatewayRepository = container => {

  const disconnect = () => undefined

  return Object.create({
    disconnect
  })
}

const connect = container => {
  return new Promise((resolve, reject) => {
    resolve(gatewayRepository(container))
  })
}

module.exports = Object.assign({}, {connect})
