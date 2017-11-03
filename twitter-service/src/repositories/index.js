const twitterJobRepository             = require('./twitterJobRepository')
const twitterUserConnectionsRepository = require('./twitterUserConnectionsRepository')
const twitterRateLimitRepository       = require('./twitterRateLimitRepository')
const twitterCredentialsRepository    = require('./twitterCredentialsRepository')

const connect = container => {
  return Promise.all([
    twitterJobRepository.connect(container),
    twitterUserConnectionsRepository.connect(container),
    twitterRateLimitRepository.connect(container),
    twitterCredentialsRepository.connect(container)
  ]).then(resp => {
    return {
      twitterJobRepository: resp.shift(),
      twitterUserConnectionsRepository: resp.shift(),
      twitterRateLimitRepository: resp.shift(),
      twitterCredentialsRepository: resp.shift()
    }
  })
}

module.exports = connect
