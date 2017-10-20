const makeObjectId = require('../helpers/makeObjectId')

const serviceRegistryModel = (joi, encrypt) => {
  const schema = {
    containerName: joi.string().required(),
    containerPort: joi.string().required(),
    method: joi.string().required(),
    endpoint: joi.string().required(),
    authorizedRoles: joi.array().default([]),
    originUrl: joi.string().required(),
    id: joi.string().optional(),
    _id: joi.any().optional(),
    serviceKey: joi.string().required(),
    __type: joi.string().default('serviceRegistry', 'type of model')
  }

  const validate = object => joi.validate(object, schema)

  const fromDocument = object => {
    const { _id: id } = object;

    delete object._id;
    return joi.validate(Object.assign({}, object, { id: id.toString() }), schema)
  }

  const toDocument = object => {
    const { _id } = object

    delete object.id;

    return joi.validate(Object.assign({}, object, {
      _id: _id ? makeObjectId(_id) : _id,
      serviceKey: `${object.method}:${object.originUrl}`,
    }))
  }

  return {
    validate,
    fromDocument,
    toDocument
  }
}

module.exports = serviceRegistryModel;
