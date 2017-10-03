const express           = require('express');

// ======================================================
// Define Express Controller
// ======================================================
const importController = express.Router();

// ======================================================
// Response Handlers
// ======================================================
const getErrorResponse = error => {
  switch(error) {
    default:
      return {
        status: 500,
        error
      };
  }
};

const responseHandler = (req, res) => {
  if (req.error) {
    const {status, err} = getErrorResponse(req.error);
    res.status(status).send({err});
  } else {
    const {results} = req;
    res.status(200).send(results);
  }
};

// ======================================================
// Controller Methods
// ======================================================
const postImport = (req, res, next) => {

}

importController.post('/', postImport, responseHandler);
module.exports = importController;
