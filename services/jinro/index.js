'use strict';

/**
 * Module dependencies.
 */
const IntegrationService  = require('../integrationService');
const async               = require('async');
const CronJob             = require('cron').CronJob;
const updateIntegration   = require('./updateIntegration');
const processTwitterUsers = require('./twitter/processTwitterUsers');

/*
 * Error Messages
 */

const invalidTwitterCredentials = 'Twitter access token is invalid.';
const integrationError = 'An error occurred during Twitter integration.';

function integrationSuccessHandler(id, cb) {
  let update = {
    finishedDate: new Date(),
    status: 'completed',
    statusMsg: 'Twitter successfully completed.'
  };
  updateIntegration(id, update, () => cb());
}

function integrationErrorHandler(id, err, cb) {
  let update = { 
    finishedDate: new Date(),
  };
  if (err === 'Integration has been cancelled.') {
    update.status = 'cancelled';
    update.statusMsg = 'Integration has been cancelled.';
  } else {
    update.status = 'error';
    update.statusMsg = err;
  }
  updateIntegration(id, update, () => cb());
}

function onCronJobFinished() {
  
}

function scheduleCronJob(integration, delay) {
  const startTime = new Date();
  startTime.setSeconds(startTime.getSeconds() + delay);
  
  return new CronJob(
    startTime, 
    cb => runIntegration(integration, cb), 
    onCronJobFinished, 
    true, 
    'America/Los_Angeles'
  );
}

function runIntegration(integration, cb) {
  if (!integration) { 
    return cb('invalid integration');
  }
  
  const statusUpdate = {
    status: 'inProgress',
    statusMsg: 'running integration'
  }
  
  updateIntegration(integration.id, statusUpdate, (err, updatedIntegration) => {
    if (err || !updatedIntegration) {
      return cb('Error occurred while updating the integration.');
    }

    const onFinished = (err) => {
      if (err) {
        return integrationErrorHandler(integration.id, err, cb);
      } else {
        return integrationSuccessHandler(integration.id, cb);
      }
    }
    processTwitterUsers(updatedIntegration, onFinished)
  });
}

function runPendingIntegrations() {
  IntegrationService.getPendingIntegrations((err, results=[]) => {
    if (err) {
      return err;
    }

    const interval = 1;
    results.forEach((cur, i) => {
      scheduleCronJob(cur, interval*(i+1));
    });
  });   
}

function rebootActiveIntegrations() {
  IntegrationService.getPendingAndActiveIntegrations((err, results=[]) => {
    if (err) {
      return err;
    }
    const interval = 1;
    results.forEach((cur, i) => {
      scheduleCronJob(cur, interval*(i+1));
    });
  });
}

module.exports = {
  runPendingIntegrations,
  rebootActiveIntegrations
}
