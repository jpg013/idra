const institutionID = require('../../helpers/makeObjectId')('59f88603a46e9900b7f7bbc6')

const insertRootJob = (db, cb) => {
  const collection = db.collection('twitter_jobs')

  collection.findOne({institutionID}, (err, job) => {
    if (err) {
      return cb(err)
    }

    if (job) {
      return cb()
    }

    const $insert = {
      created: new Date(),
      twitterUsers: [],
      totalCount: 0,
      cursor: 0,
      institutionID,
      status: 'pending'
    }

    collection.insertOne($insert, cb)
  });
}

module.exports = insertRootJob;
