'use strict';

/**
 * Module dependencies.
 */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('./config');
const chalk = require('chalk');

app.set('token-secret', config.tokenSecret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

/**
 * Controllers
 */

app.use(function(req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send({
      success: false,
      message: 'No token provided'
    })
  }

  jwt.verify(token, app.get('token-secret'), function(err, authToken) {
    if (err) {
      return res.json({ success: false, message: 'Failed to authenticate token.' });
    }
    req.authToken = authToken;
    return next();
  });
});


const BASE_API_PATH = '/api';
const USER_API_PATH = BASE_API_PATH + '/user';
const SUBJECT_API_PATH = BASE_API_PATH + '/subject';

const userController = require('./controllers/user.controller');
const subjectController = require('./controllers/subject.controller');

app.use(USER_API_PATH, userController);
app.use(SUBJECT_API_PATH, subjectController);

/**
 * Configuration
 */
var port = process.env.PORT || 9001;
mongoose.connect(config.database);
mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

app.get('/', function(req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.listen(port);
console.log('Magic happens at http://localhost:' + port);
