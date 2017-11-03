const twitter = require('./twitter')
const neo4j   = require('./neo4j')

const connect = container => {
  return new Promise((resolve) => {
    const services = {
      neo4j: neo4j(container),
      twitter: twitter(container)
    }
    resolve(services)
  })
}

module.exports = connect
