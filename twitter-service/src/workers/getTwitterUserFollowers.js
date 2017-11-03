function connect(container) {

  async function getTwitterUserFollowers(screenName, twitterCredentials, results=[], cursor=-1) {
    const { waitForAvailableRateLimit } = container.resolve('workers')
    const { twitter } = container.resolve('services')

    await waitForAvailableRateLimit('followers', twitterCredentials)

    const args = {
      screen_name: screenName,
      cursor
    }

    // We have secured a rate limit, call twitter api
    const { users, next_cursor, previous_cursor } = await twitter.getTwitterUserFollowers(twitterCredentials, args)

    // Check if more pages exist
    if (next_cursor === previous_cursor) {
      return results.concat(users)
    }

    return await getTwitterUserFollowers(screenName, twitterCredentials, results.concat(users), next_cursor)
  }

  return getTwitterUserFollowers
}

module.exports = connect
