'use strict';

/**
 * Module dependencies.
 */
const http           = require('http')
const express        = require('express');
const bodyParser     = require('body-parser');
const logger         = require('morgan');
const mongoose       = require('mongoose');
const dotenv         = require('dotenv');
const apiRouter      = require('./api/index');
const publicRouter   = require('./public/index');
const authMiddleware = require('./middleware/auth');
const socket         = require('./socket/index');

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

/**
 * Public Router
 */
publicRouter.config(app);


/*
 * Configure Middleware
 */
app.use('/api', authMiddleware.isAuthenticated);

/**
 * Api Router
 */
apiRouter.config(app);

/**
 * Config Sockets
 */
socket.config(server);

/**
 * Listen on Port
 */

server.listen(process.env.PORT);
console.log('Magic happens at http://localhost:' + process.env.PORT );