const connect = container => {
  const { twitterJobRepository } = container.cradle.repositories
  const { neo4j } = container.cradle.services

  async function setupJob(twitterJob, cb) {
    const twitterUsers = await neo4j.getTwitterScreenNames()
    twitterUsers.sort((a, b) => b.screenName - a.screenName)

    twitterJob.twitterUsers = twitterUsers
    twitterJob.status = 'inProgress'
    twitterJob.totalCount = twitterUsers.length

    return await twitterJobRepository.updateJob(twitterJob)
  }

  return setupJob
}

module.exports = connect
