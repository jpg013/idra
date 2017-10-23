const populateAuthenticatedUser = container => {
  const { users } = container.resolve('services')

  return (req, res, next) => {
    const { bearerToken } = req;

    if (!bearerToken) {
      return next()
    }

    const { userName } = bearerToken;

    users.getUserByUsername(userName)
      .then(user => {
        req.user = user
        next()
      }).catch(next)
      
  }
}

module.exports = populateAuthenticatedUser
