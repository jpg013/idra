'use strict';

/**
 * Module dependencies.
 */
const http           = require('http')
const express        = require('express');
const bodyParser     = require('body-parser');
const logger         = require('morgan');
const mongoose       = require('mongoose');
const chalk          = require('chalk');
const dotenv         = require('dotenv');
const io             = require('./config/socket.io');
const apiRouter      = require('./api/index');
const publicRouter   = require('./public/index');
const authMiddleware = require('./middleware/auth');

/*
 * Read environment config
 */
dotenv.config();

/**
 * Connect to MongoDB
 */
require('./config/mongo').config();

/*
 * Create our express app and server
 */
const app     = express();
const server  = http.createServer(app);

/**
 * App Configuration
 */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/*
 * Configure Middleware
 */
app.use(authMiddleware.isAuthenticated);

/**
 * Configure Public Routes
 */
publicRouter.config(app);

/**
 * Configure Api Routes
 */
apiRouter.config(app);

/**
 * Config Socket.io
 */
io.config(server);

/**
 * Listen on Port
 */

server.listen(process.env.PORT);
console.log('Magic happens at http://localhost:' + process.env.PORT );