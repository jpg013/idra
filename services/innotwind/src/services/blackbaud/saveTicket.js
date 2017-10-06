const updateInstitution = require('../institutions/updateInstitution')

const saveTicket = (institutionId, ticket, cb) => {
  const expires = (new Date().getTime() + (1000 * Number(ticket.expires_in - 60)));

  const $update = {
    '$set': {
      'bbc.ti': ticket,
      'bbc.ex': expires
    }
  }
  updateInstitution(institutionId, $update, cb);
}

module.exports = saveTicket;
