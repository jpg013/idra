const twitterUserConnectionsModel = (joi, encrypt) => {
  const schema = {
    friends: joi.array().required(),
    followers: joi.array().required(),
    screenName: joi.string().required(),
    constituentID: joi.number().required(),
    _id: joi.any().optional(),
    __type: joi.string().default('twitterUserConnection', 'type of model')
  }

  const validate = object => joi.validate(object, schema)

  const fromDocument = object => {
    return joi.validate(Object.assign({}, object, {
      __type: 'twitterUserConnections'
    }), schema)
  }

  const toDocument = object => {
    const newObj = Object.assign({}, object)

    delete newObj.__type
    delete newObj._id

    return joi.validate(newObj)
  }

  return {
    validate,
    fromDocument,
    toDocument
  }
}

module.exports = twitterUserConnectionsModel;
