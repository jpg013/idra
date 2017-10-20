const decrypt    = require('../helpers/decrypt');
const httpStatus = require('http-status-codes');

const ensureAccessSecret = (req, res, next) => {
  const { access_secret } = req.query;

  if (!access_secret || decrypt(access_secret) !== process.env.ACCESS_SECRET) {
    return res.status(httpStatus.FORBIDDEN)
      .send(httpStatus.getStatusText(httpStatus.FORBIDDEN));
  }

  return next();
};

module.exports = ensureAccessSecret;
