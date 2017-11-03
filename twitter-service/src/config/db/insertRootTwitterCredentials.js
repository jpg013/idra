const institutionID = require('../../helpers/makeObjectId')('59f88603a46e9900b7f7bbc6')

const insertRootTwitterCredentials = (db, cb) => {
  const collection = db.collection('twitter_credentials')
  const $update = {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    institutionID
  }
  const $opts = { upsert: true }
  const $query = { _id: institutionID }

  collection.updateOne($query, $update, $opts, cb)
}

module.exports = insertRootTwitterCredentials;
