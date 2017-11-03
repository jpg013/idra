const { waitForRateLimitToExpire } = require('../helpers/rateLimit')

const connect = container => {
  async function waitForAvailableRateLimit(type, twitterCredentials) {
    const { twitterRateLimitRepository } = container.resolve('repositories')

    // see if we can secure an available rate limit
    if (await twitterRateLimitRepository.secureRateLimit(type, twitterCredentials.access_token_key)) {
      return true
    }

    const rateLimitReset = await twitterRateLimitRepository.getRateLimitReset(type, twitterCredentials.access_token_key)

    await waitForRateLimitToExpire(type, rateLimitReset)

    // rate limit has expired
    await container.resolve('workers').refreshRateLimit(twitterCredentials)

    return await waitForAvailableRateLimit(type, twitterCredentials)
  }

  return waitForAvailableRateLimit
}

module.exports = connect
