const dial = require('../libs/dial')

const users = container => {
  const serviceEndpoints = container.resolve('serviceEndpoints')

  const getUserByUsername = userName => {
    const url = `${serviceEndpoints.usersService}/users/username`
    const opts = { queryParams: { userName } }
    return dial(url, 'get', opts).then((resp={}) => resp.user)
  }

  return Object.create({
    getUserByUsername
  })
}

module.exports = users;
