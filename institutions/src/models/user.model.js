const userModel = (joi, encrypt) => {
  const schema = {
    userName: joi.string().required(),
    password: joi.string().required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    roles: joi.array().default([]),
    createdDate: joi.date().default(Date.now, 'time of creation'),
    lastLoginDate: joi.date(),
    passwordChangeRequired: joi.boolean(),
    id: joi.string().optional(),
    _id: joi.any().optional(),
    __type: joi.string().default('user', 'type of model')
  }

  const validate = object => joi.validate(object, schema)

  const fromDocument = object => {
    const { _id: id } = object;

    delete object._id;
    return joi.validate(Object.assign({}, object, { id: id.toString() }), schema)
  }

  const toDocument = object => {

  }

  return {
    validate,
    fromDocument,
    toDocument
  }
}

module.exports = userModel;
