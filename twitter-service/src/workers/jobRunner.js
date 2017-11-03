const winston = require('winston')

const connect = container => {
  async function jobRunner(twitterJob, cb) {
    if (!twitterJob) {
      return cb('missing required Twitter Job.')
    }

    /*
     * Resolve our dependencies
     */
    const {
      twitterJobRepository,
      twitterUserConnectionsRepository,
      twitterCredentialsRepository,
      twitterRateLimitRepository
    } = container.resolve('repositories')
    const { twitter } = container.cradle.services
    const {
      refreshRateLimit,
      getTwitterUserFriends,
      getTwitterUserFollowers,
      createTwitterUserConnections
    } = container.resolve('workers')

    while(await twitterJobRepository.isJobRunning(twitterJob)) {
      const twitterUser = await twitterJobRepository.getNextUserToProcess(twitterJob)

      twitterJob.userInProgress = twitterUser;
      twitterJob = await twitterJobRepository.updateJob(twitterJob)

      if (!twitterUser) {
        break
      }

      winston.log('info', 'processing user - ', twitterUser.name)

      // Get the institution twitter credentials
      const twitterCredentials = await twitterCredentialsRepository.getTwitterCredentialsForInstitution(twitterJob.institutionID)

      // Refresh the rate limit in the database
      await refreshRateLimit(twitterCredentials)

      try {


        const [friends, followers] = [
          await getTwitterUserFriends(twitterUser.screenName, twitterCredentials),
          await getTwitterUserFollowers(twitterUser.screenName, twitterCredentials)
        ]

        await createTwitterUserConnections(twitterUser, friends, followers)
      } catch(err) {
        winston.log('error', err)
      } finally {
        twitterJob.cursor = twitterJob.cursor + 1
        twitterJob = await twitterJobRepository.updateJob(twitterJob)
      }
    }
  }

  return jobRunner
}

module.exports = connect
