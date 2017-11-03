'use strict'
const makeObjectId = require('../helpers/makeObjectId')

const twitterJobRespository = container => {
  const { database: db, models } = container.cradle
  const collection = db.collection('twitter_jobs')

  const disconnect = () => db.close()

  async function updateJob(job) {
    const $query = { _id: makeObjectId(job._id) }
    const updateValue = await models.toDocument(job, 'twitterJob')
    const $update = { $set: updateValue }
    await collection.updateOne($query, $update)

    return await getJobById(job._id)
  }

  async function getJobById(id) {
    const $query = { _id: makeObjectId(id) }
    const $proj = { twitterUsers: 0 }
    const result = await collection.findOne($query, $proj)
    return result ? await models.fromDocument(result, 'twitterJob') : result
  }

  async function getPendingOrInProgressJobs() {
    const $query = { status: { $in: ['pending', 'inProgress'] } }
    const $proj = { twitterUsers: 0 }
    const colResp = await collection.find($query, $proj).toArray()
      .then(resp => {
        const modelPromises = resp.map(cur => models.fromDocument(cur, 'twitterJob'))
        return Promise.all(modelPromises)
      })
    return colResp
  }

  async function getNextUserToProcess(twitterJob) {
    const $query = { _id : makeObjectId(twitterJob._id) }
    const $proj = { twitterUsers: {$slice: [twitterJob.cursor, 1] } }

    const results = await collection.findOne($query, $proj)
    return results ? results.twitterUsers[0] : undefined
  }

  async function isJobRunning(twitterJob) {
    const $query = { _id : makeObjectId(twitterJob._id) }
    const $proj = { status: 1, totalCount: 1, cursor: 1}

    const { status, totalCount, cursor } = await collection.findOne($query, $proj)

    if (status !== 'inProgress') {
      return false
    }

    return (cursor < totalCount)
  }

  return Object.create({
    disconnect,
    updateJob,
    isJobRunning,
    getPendingOrInProgressJobs,
    getNextUserToProcess
  })
}

const connect = container => {
  return new Promise((resolve, reject) => {
    const db = container.resolve('database')

    if (!db) {
      reject(new Error('connection db not supplied!'))
    }

    resolve(twitterJobRespository(container))
  })
}

module.exports = Object.create({connect})
