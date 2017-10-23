const logGatewayRequest = container => {
  return (req, res, next) => {
    // TODO: Log request
    return next()
  }
}

module.exports = logGatewayRequest
