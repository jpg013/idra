const httpStatus = require('http-status-codes')

const ensureUserAuthenticated = container => {
  return (req, res, next) => {
    if (!req.user || !req.user.id) {
      return res.status(httpStatus.UNAUTHORIZED).send({
        success: false,
        msg: 'Unauthorized.'
      });
    }

    return next()
  }
}

module.exports = ensureUserAuthenticated
