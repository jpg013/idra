const findOneAndUpdate = require('../../db/jobs/findOneAndUpdate');

const saveJobTicket = (id, ticket, callback) => {
  console.log('updating the freaking ticket');
  const $update = { '$set': {'ticket': ticket } };
  findOneAndUpdate(id, $update, callback);
}

module.exports = saveJobTicket;
