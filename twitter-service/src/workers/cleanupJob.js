const connect = container => {
  const { twitterJobRepository } = container.cradle.repositories

  async function cleanupJob(twitterJobId, error) {
    const twitterJob = await twitterJobRepository.getJobById(twitterJobId)

    if (error) {
      twitterJob.status = 'error'
    } else {
      twitterJob.status = 'completed'
    }

    twitterJob.finished = new Date()
    twitterJob.userInProgress = {}

    return twitterJobRepository.updateJob(twitterJob)
  }

  return cleanupJob
}

module.exports = connect
