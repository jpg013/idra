const Twitter = require('twitter')
const { parseRateLimit } = require('../helpers/rateLimit')

const twitterService = container => {
  const getTwitterAPI = ({consumer_key, consumer_secret, access_token_key, access_token_secret}) => {
    return new Twitter({
      consumer_key,
      consumer_secret,
      access_token_key,
      access_token_secret
    })
  }

  async function getRateLimit(twitterCreds) {
    const twitterAPI = getTwitterAPI(twitterCreds)

    return new Promise((resolve, reject) => {
      twitterAPI.get('application/rate_limit_status', (err, resp) => {
        if (err) {
          return reject(err)
        }
        resolve(parseRateLimit(resp))
      })
    })
  }

  async function getTwitterUserFriends(twitterCreds, options) {
    const args = Object.assign({}, options, {
      count: 200
    })
    const twitterAPI = getTwitterAPI(twitterCreds)

    return new Promise((resolve, reject) => {
      twitterAPI.get('friends/list', args, (err, results={}) => {
        if (err) {
          return reject(err)
        }
        return resolve(results)
      })
    })
  }

  async function getTwitterUserFollowers(twitterCreds, options) {
    const args = Object.assign({}, options, {
      count: 200
    })
    const twitterAPI = getTwitterAPI(twitterCreds)

    return new Promise((resolve, reject) => {
      twitterAPI.get('followers/list', args, (err, results={}) => {
        if (err) {
          return reject(err)
        }
        return resolve(results)
      })
    })
  }

  async function getTwitterUserProfile(screenName) {
    const args = {
      screen_name: screenName,
    }

    return new Promise((resolve, reject) => {
      twitterAPI.get('users/show', args, function(err, results = {}) {
        if (err) {
          return reject(err)
        }
        return resolve(results.id)
      })
    })
  }

  return Object.create({
    getRateLimit,
    getTwitterUserFriends,
    getTwitterUserFollowers,
    getTwitterUserProfile
  })
}

module.exports = twitterService
