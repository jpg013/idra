const proxy      = require('http-proxy-middleware')
const httpStatus = require('http-status-codes')

const makeApiProxy = container => {
  return (route, target, routePermissions) => {
    const pathRewrite = {}
    const rewriteKey = `^api/${route}`
    pathRewrite[rewriteKey] = '' // Rewrite path to target path

    const apiProxy = proxy({
      target,
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite
    });

    return (req, res, next) => {
      const userRoles  = req.user ? req.user.roles : []
      
      const missingRole = routePermissions.find(cur => userRoles.indexOf(cur) < 0);

      if (missingRole) {
        res.status(httpStatus.FORBIDDEN).send({'msg': 'Forbidden'})
        next()
      }

      apiProxy(req, res, next)
    }
  }
}

module.exports = makeApiProxy;