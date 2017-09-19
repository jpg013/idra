const jwt     = require('jsonwebtoken');
const decrypt = require('../../helpers/decrypt');
const dial    = require('../../dial');

const signInErrorMsg  = 'An error occurred while signing in.';
const signInFailedMsg = 'Invalid username or password.';

const authenticateUser = (username, password, cb) => {
  const queryParams = { username };
  
  const dialOptions = {
    containerName: process.env.INNOSOL_CONTAINER_NAME,
    containerPort: process.env.INNOSOL_CONTAINER_PORT,
    endpoint: 'users/username',
    protocol: 'get',
    queryParams,
  };

  dial(dialOptions, (err, resp, body) => {
    if (err) {
      return cb(signInErrorMsg);
    }

    body = JSON.parse(body);

    if (resp.statusCode !== 200 || body.error) {
      return cb(body.error || signInErrorMsg);
    }

    const { results: user } = body;

    if (!user) {
      return cb(undefined, {success: false, msg: signInFailedMsg});
    }
    
    if (password !== decrypt(user.password)) {
      return cb(undefined, {success: false, msg: signInFailedMsg});
    }

    // Delete the password from the user response
    delete user.password;

    const expiresIn = (24 * 60 * 60);
    const token = jwt.sign(
      user, 
      process.env.CRYPTO_KEY, 
      { expiresIn }
    );
    const authTokenResults = {
      token,
      expiresIn,
      success: true
    };

    return cb(undefined, authTokenResults);
  });
};

  module.exports = authenticateUser;