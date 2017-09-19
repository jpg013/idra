// ======================================================
// Module dependencies
// ======================================================
const bodyParser = require('body-parser');
const logger     = require('morgan');
const api        = require('./api');
const path       = require('path');
const express    = require('express');

/**
 * App Configuration
 */

const handleUnknownRoutes = (req, res) => {
  res.status(404).send();
};

const configApp = app => {
  /**
   * Middleware config
  */
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(express.static('public'));
  app.use(express.static(path.join(__dirname, 'public')));
  
  // Configure the api
  api(app);
  
  // Handles all routes so you do not get a not found error
  app.get('*', handleUnknownRoutes);
  return app;
};

module.exports = configApp;
