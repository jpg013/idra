function connect(container) {

  async function getTwitterUserFriends(screenName, twitterCredentials, results=[], cursor=-1) {
    const { waitForAvailableRateLimit } = container.resolve('workers')
    const { twitter } = container.resolve('services')

    await waitForAvailableRateLimit('friends', twitterCredentials)

    // We have secured a rate limit, call twitter api

    const args = {
      screen_name: screenName,
      cursor
    }

    const { users, next_cursor, previous_cursor } = await twitter.getTwitterUserFriends(twitterCredentials, args)

    // Check if more pages exist
    if (next_cursor === previous_cursor) {
      return results.concat(users)
    }

    return await getTwitterUserFriends(screenName, twitterCredentials, results.concat(users), next_cursor)
  }

  return getTwitterUserFriends
}

module.exports = connect
