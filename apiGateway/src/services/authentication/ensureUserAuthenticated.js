const dial = require('../../dial');

const ensureUserAuthenticated = (req, res, next) => {
  const { bearerToken } = req;

  if (!bearerToken) {
    return res.status(401).send({
      success: false,
      msg: 'No bearer token.'
    });
  }

  const { username } = bearerToken;
  const queryParams = { username };
  
  const dialOptions = {
    containerName: process.env.INNOSOL_CONTAINER_NAME,
    containerPort: process.env.INNOSOL_CONTAINER_PORT,
    endpoint: 'users/username',
    protocol: 'get',
    queryParams,
  };

  dial(dialOptions, (err, resp) => {
    if (err) {
      return res.status(500).send({
        success: false,
        msg: 'An error occurred.'
      });
    }

    if (resp.statusCode !== 200 || resp.error) {
      return res.status(401).send({
        success: false,
        msg: 'An error occurred.'
      });
    }

    const { results: user } = resp;

    if (!user) {
      return res.status(401).send({
        success: false,
      });
    }

    // Delete the password from the user response
    delete user.password;
    req.user = user;
    next();
  });

  
};

module.exports = ensureUserAuthenticated;
