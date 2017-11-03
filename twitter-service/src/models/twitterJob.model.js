const twitterJobModel = (joi, encrypt) => {
  const schema = {
    created: joi.date().default(Date.now, 'time of creation'),
    finished: joi.date(),
    twitterUsers: joi.array(),
    totalCount: joi.number().required(),
    status: joi.any().allow(['pending', 'running', 'error', 'completed']),
    userInProgress: joi.any(),
    cursor: joi.number().default(0, 'cursor position of twitter users in progress'),
    institutionID: joi.any().required(),
    _id: joi.any().optional(),
    __type: joi.string().default('twitterJob', 'type of model')
  }

  const validate = object => joi.validate(object, schema)

  const fromDocument = object => {
    return joi.validate(Object.assign({}, object, {
      __type: 'twitterJob'
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

module.exports = twitterJobModel;
