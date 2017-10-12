// ======================================================
// Module dependencies
// ======================================================
const http           = require('http');
const express        = require('express');
const configApp      = require('./app');
const initDb         = require('./db/init');
const chalk          = require('chalk');
const receiveJobs    = require('./services/mq/actions/receiveJobs');
const rebootJobs     = require('./services/jobs/rebootJobs');

// ======================================================
// Setup the database
// ======================================================
initDb(err => {
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

// ======================================================
// Begin receiving new jobs from mq
// ======================================================
receiveJobs();

// ======================================================
// Reboot pending / in-progress jobs
// ======================================================
rebootJobs();
