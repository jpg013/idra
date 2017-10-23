const express                 = require('express')
const httpStatus              = require('http-status-codes')
const decrypt                 = require('../../helpers/decrypt')
const jwt                     = require('jsonwebtoken')

const AuthenticationController = container => {
  const { users } = container.resolve('services')
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
  const postSignIn = (req, res, next) => {
    const { username, password } = req.body

    if (!username || !password) {
      req.errror = 'Invalid username or password.'
      return next()
    }

    users.getUserByUsername(username)
      .then(user => {
        if (!user) {
          req.results = {
            success: false,
            msg: 'Invalid username or password.'
          }
          return next()
        }

        if (password !== decrypt(user.password)) {
          req.results = {
            success: false,
            msg: 'Invalid username or password.'
          }
          return next()
        }

        // Delete the password from the user response
        delete user.password

        const expiresIn = (24 * 60 * 60)
        const token = jwt.sign(
          user,
          process.env.CRYPTO_KEY,
          { expiresIn }
        )

        req.results =  {
          token,
          expiresIn,
          success: true
        }
        console.log('what is happneing?')
        next()
      })
      .catch(e => {
        req.error = 'There was an error authenticating the user.'
        next()
      })
  }

  const getAuthenticatedUser = (req, res, next) => {
    const { user } = req

    req.results = { user }
    next()
  }

  controller.post('/', postSignIn, responseHandler)
  controller.get('/user', getAuthenticatedUser, responseHandler)

  return controller
}

module.exports = AuthenticationController
