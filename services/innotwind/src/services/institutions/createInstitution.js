const makeInsertProps = require('../../db/institutions/makeInsertProps');
const insertOne       = require('../../db/institutions/insertOne');

const createInstitution = (institutionData, cb) => {
  const $insert = makeInsertProps(institutionData);

  insertOne($insert, cb)
};

module.exports = createInstitution;
