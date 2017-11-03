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

  const mapTwitterUsers = users => {
    return users.map(cur => ({
      id: cur.id,
    	name: cur.name,
    	screen_name: cur.screen_name,
    	location: cur.location,
    	description: cur.description,
    	followers_count: cur.followers_count,
    	friends_count: cur.friends_count,
    	created_at: cur.created_at,
    	following: cur.following,
    	follow_request_sent: cur.follow_request_sent,
    	muting: cur.muting,
    	blocking: cur.blocking
    }))
  }

  const getRateLimit = twitterCreds => {
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

  const getTwitterUserFriends = (twitterCreds, options) => {
    const args = Object.assign({}, options, {
      count: 200
    })
    const twitterAPI = getTwitterAPI(twitterCreds)

    return new Promise((resolve, reject) => {
      twitterAPI.get('friends/list', args, (err, results={}) => {
        if (err) {
          return reject(err)
        }
        const data = {
          users: mapTwitterUsers(results.users),
          next_cursor: results.next_cursor,
          previous_cursor: results.previous_cursor
        }

        return resolve(data)
      })
    })
  }

  const getTwitterUserFollowers = (twitterCreds, options) => {
    const args = Object.assign({}, options, {
      count: 200
    })
    const twitterAPI = getTwitterAPI(twitterCreds)

    return new Promise((resolve, reject) => {
      twitterAPI.get('followers/list', args, (err, results={}) => {
        if (err) {
          return reject(err)
        }

        const data = {
          users: mapTwitterUsers(results.users),
          next_cursor: results.next_cursor,
          previous_cursor: results.previous_cursor
        }

        return resolve(data)
      })
    })
  }

  const getTwitterUserProfile = screenName =>  {
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
