const MongoClient = require('mongodb');

const makeObjectId = id => {
  let objectId;
  try {
    objectId = MongoClient.ObjectID(id);
  } catch(e) {
    objectId = id;
  }

  return objectId;
}

module.exports = makeObjectId;
