const winston = require('winston')

async function waitForRateLimitToExpire(type, reset) {
  const rateLimitExpire = (reset * 1000) + 5000 // convert to milliseconds, then add 5s for padding

  return new Promise(resolve => {
    winston.log('info', `waiting for ${type} rate limit to expire at ', ${new Date(rateLimitExpire).toLocaleString()}`)

    const wait = Math.max(rateLimitExpire - new Date().getTime(), 1000)

    // Await rate limit expire
    setTimeout(() => {
      winston.log('info', `waking up from ${type} rate limit timeout at - ${new Date().toLocaleString()}`)
      resolve()
    }, wait);
  })
}

const parseRateLimit = rateLimitObject => {
  const { resources, rate_limit_context } = rateLimitObject

  const friends = {
    remaining: resources.friends['/friends/list'].remaining,
    reset: resources.friends['/friends/list'].reset
  };

  const followers = {
    remaining: resources.followers['/followers/list'].remaining,
    reset: resources.followers['/followers/list'].reset
  };

  const application = {
    remaining: resources.application['/application/rate_limit_status'].remaining,
    reset: resources.application['/application/rate_limit_status'].reset
  }

  return Object.assign({}, {
    friends,
    followers,
    application,
    applicationToken: rate_limit_context.access_token
  })
}

module.exports = Object.create({
  waitForRateLimitToExpire,
  parseRateLimit
})
