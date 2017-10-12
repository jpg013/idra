const findOneAndUpdate = require('../../db/institutions/findOneAndUpdate');

const saveBlackbaudTicket = (institutionId, ticket, cb) => {
  const $update = {
    '$set': { 'blackBaudCredentials.ticket': ticket }
  }
  findOneAndUpdate(institutionId, $update, cb);
}

module.exports = saveBlackbaudTicket;
