'use strict';

/**
 * Module dependencies.
 */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config');
const chalk = require('chalk');

/*
 * Middleware
 */
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const authMiddleware = require('./middleware/auth');

/**
 * Controllers
 */

const userController    = require('./controllers/user.controller');
const subjectController = require('./controllers/subject.controller');
const loginController   = require('./controllers/login.controller');
const teamController    = require('./controllers/team.controller');

app.use(loginController);

/**
 * Api Router
 */

const apiRouter = express.Router();
apiRouter.use(authMiddleware.isAuthenticated);
apiRouter.use('/team', teamController);
apiRouter.use('/user', userController);
apiRouter.use('/subject', subjectController);

app.use('/api', apiRouter);

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
