const findOneAndUpdate = require('../../db/institutions/findOneAndUpdate');

const saveBlackbaudTicket = (institutionId, ticket, cb) => {
  const expires = (new Date().getTime() + (1000 * Number(ticket.expires_in - 60)));

  const $update = {
    '$set': {
      'blackBaudCredentials.ticket': ticket,
      'blackBaudCredentials.expires': expires
    }
  }
  findOneAndUpdate(institutionId, $update, cb);
}

module.exports = saveBlackbaudTicket;
