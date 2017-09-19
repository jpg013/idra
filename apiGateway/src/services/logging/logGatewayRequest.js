const formatRequestUrl = require('./formatRequestUrl');
const dbConnector      = require('../../db/connector');

const logGatewayRequest = (req, res, next) => {
  const requestUrl = formatRequestUrl(req.get('host'), req.url, req.protocol);
  const authenticatedUser = req.authenticatedUser;

  dbConnector.getConnection((err, dbConn) => {
    if (err || !dbConn) {
      return next();
    }

    const $insert = {
      url: requestUrl,
      time: new Date().toISOString()
    };

    if (authenticatedUser) {
      $insert.user = authenticatedUser.userName;
    }

    dbConn.collection('requestlogs').insertOne($insert);
    next();
  });
};

module.exports = logGatewayRequest;
