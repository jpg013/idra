const populateAuthenticatedUser = (req, res, next) => {
  const tokenPayload = req.headers.authTokenPayload;
  
  if (!tokenPayload) {
    return res.status(401).send({
      success: false,
      message: 'User is not authenticated.'
    });
  }
    
  const options = {
    method: 'GET',
    uri: `http://localhost:8001/users?id=${authTokenPayload.id}`,
    json: true
  };
  
  request(options, (err, resp, body) => {
  
  });
};

module.exports = populateAuthenticatedUser;
