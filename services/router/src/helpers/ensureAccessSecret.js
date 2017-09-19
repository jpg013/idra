const decrypt = require('./decrypt');

const ensureAccessSecret = (req, res, next) => {
  const { access_secret } = req.query;
  
  if (!access_secret) {
    return res.status(401).send({
      success: false,
      message: 'Invalid access key.'
    });
  }

  const decryptedSecret = decrypt(access_secret);

  if (decryptedSecret !== process.env.SERVICE_ACCESS_SECRET) {
    return res.status(401).send({
      success: false,
      message: 'Invalid access key.'
    });
  }
  return next();
};

module.exports = ensureAccessSecret;
