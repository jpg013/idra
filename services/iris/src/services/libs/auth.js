const oauth2 = require('simple-oauth2');

const oauth2Client = (id, secret) => {
  const credentials = {
    client: {
      id,
      secret
    },
    auth: {
      tokenHost: 'https://oauth2.sky.blackbaud.com',
      tokenPath: '/token',
      authorizePath: '/authorization'
    }
  };
  return oauth2.create(credentials);
};

const refreshTicket = (ticket, clientId, clientSecret, cb) => {
  const oauthClient = oauth2Client(clientId, clientSecret);
  const accessToken = oauthClient.accessToken.create(ticket);

  accessToken.refresh(function (err, results={}) {
    if (err || !results) {
      return cb('Could not get valid ticket.');
    }
    return cb(err, results.token);
  });
}

const isTicketExpired = (ticket) => {
  if (!ticket) {
    return true;
  }

  const timeCurrent = new Date().getTime();
  const timeExpires = (new Date(ticket.expires_at).getTime() - 60000); // expires at - 1 minute
  return (timeCurrent >= timeExpires);
};

const validateJobTicket = (job={}, callback) => {
  const { ticket, subscriptionKey, clientId, clientSecret } = job;
  if (!ticket || !subscriptionKey || !clientId || !clientSecret) {
    return callback('Could not get valid ticket.');
  }

  if (isTicketExpired(ticket)) {
    refreshTicket(ticket, clientId, clientSecret, callback);
  } else {
    return callback();
  }
};

module.exports = {
  validateJobTicket
}
