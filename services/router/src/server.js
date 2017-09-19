// ======================================================
// Module dependencies
// ======================================================
const http              = require('http');
const express           = require('express');
const configApp         = require('./app');
const chalk             = require('chalk');
const setupDatabase     = require('./db/setup');

// ======================================================
// Setup the database
// ======================================================
setupDatabase(err => {
  if (err) {
    chalk.red('%s There was an error setting up the data store. ', err);
  }
});

// ======================================================
// Create and configure the express app
// ======================================================
const app = configApp(express());

// ======================================================
// Make HTTP Server
// ======================================================
const httpServer = http.createServer(app);

// ======================================================
// Listen on port
// ======================================================
httpServer.listen(process.env.CONTAINER_PORT);
