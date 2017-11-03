const twitterRateLimitModel = (joi, encrypt) => {
  const schema = {
    friends: joi.object().required(),
    followers: joi.object().required(),
    application: joi.object().required(),
    applicationToken: joi.string().required(),
    _id: joi.any().optional(),
    __type: joi.string().default('twitterRateLimit', 'type of model')
  }

  const validate = object => joi.validate(object, schema)

  const fromDocument = object => {
    return joi.validate(Object.assign({}, object, {
      _id: object._id.toString(),
      __type: 'twitterRateLimit'
    }), schema)
  }

  const toDocument = object => {
    const newObj = Object.assign({}, object)

    delete newObj._id;
    delete newObj.__type

    return joi.validate(newObj)
  }

  return {
    validate,
    fromDocument,
    toDocument
  }
}

module.exports = twitterRateLimitModel;
