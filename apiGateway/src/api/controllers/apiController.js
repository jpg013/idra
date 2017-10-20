const express    = require('express')
const httpStatus = require('http-status-codes')

const APIController = serviceRepository => {
  const controller = express.Router()

  // ======================================================
  // Response Error Messages
  // ======================================================
  const getErrorResponse = error => {
    switch(error) {
      case 'Bad request data.':
        return {
          status: 400,
          error
        }
      default:
        return {
          status: 500,
          error
        }
    }
  }

  const responseHandler = (req, res) => {
    if (req.error) {
      const {status, error} = getErrorResponse(req.error)
      res.status(status).send({error})
    } else {
      const {results} = req
      res.status(httpStatus.OK).send(results)
    }
  }

  // ======================================================
  // Controller Methods
  // ======================================================
  const getServices = (req, res, next) => {
    //serviceRepository.get()
  }

  const registerService = (req, res, next) => {
    const { service } = req.body

    if (!service) {
      req.error = 'Bad request data.'
      return next();
    }

    serviceRepository
      .registerService(service)
      .then(() => {
        req.results = { success: true }
        next()
      })
      .catch(e => {
        console.log(e)
        req.error = e
      })
  }

  /**
   * Controller Routes
   */
  controller.get('/registry', getServices, responseHandler)
  controller.put('/registry', registerService, responseHandler)

  return controller
}

module.exports = APIController
