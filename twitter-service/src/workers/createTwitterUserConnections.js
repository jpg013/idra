const connect = container => {
  async function createTwitterUserConnections(twitterUser, friends, followers) {
    const { twitterUserConnectionsRepository } = container.resolve('repositories')

    const objData = {
      friends,
      followers,
      screenName: twitterUser.screenName,
      constituentID: twitterUser.id
    }

    return await twitterUserConnectionsRepository.createTwitterUserConnections(objData)
  }

  return createTwitterUserConnections
}

module.exports = connect
