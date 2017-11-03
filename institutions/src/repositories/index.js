const institutionRepository = require('./institutionRepository')

const config = container => {
  const institutionConnectPromise = institutionRepository.connect(container)  
  
  return Promise.all([institutionRepositoryPromise])
    .then(resp => {
      return {
        institutionRepository: resp[0]
      }
    })
}

module.exports = config