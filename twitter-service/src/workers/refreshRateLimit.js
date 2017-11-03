const connect = container => {
  return async function refreshRateLimit(twitterCredentials) {
    const { twitterRateLimitRepository } = container.resolve('repositories')
    const { twitter } = container.resolve('services')

    // Refresh the rate limit in the database
    await twitterRateLimitRepository.upsertRateLimit(await twitter.getRateLimit(twitterCredentials))
  }
}

module.exports = connect
