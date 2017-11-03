const twitterUserConnectionsModel = (joi, encrypt) => {
  const schema = {
    consumer_key: joi.string().required(),
    consumer_secret: joi.string().required(),
    access_token_key: joi.string().required(),
    access_token_secret: joi.string().required(),
    institutionID: joi.any().required(),
    _id: joi.any().optional(),
    __type: joi.string().default('twitterCredentials', 'type of model')
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
