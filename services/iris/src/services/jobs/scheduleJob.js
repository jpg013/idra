const CronJob               = require('cron').CronJob;
const { getConstituents }   = require('../libs/sky');
const jobErrorHandler       = require('./errorHandler');
const async                 = require('async');
const getById               = require('./getById');
const { validateJobTicket } = require('../libs/auth');
const saveTicket            = require('./saveTicket');
const updateJob             = require('./updateJob');

const onJobDone = err => {
  console.log('job finished with error, ' , err);
}

const validateCredentials = (job, next) => {
  validateJobTicket(job, (err, refreshedTicket) => {
    if (err) {
      // Abort, could not get validate ticket;
      return next(err);
    }

    if (refreshedTicket) {
      // Save ticket and refresh job
      saveTicket(job.id, refreshedTicket, err => {
        if (err) {
          return next(err);
        }
        return getById(jod.id, next);
      });
    } else {
      next(undefined, job);
    }
  });
}

const fetchConstituentList = (job, next) => {
  const { ticket, subscriptionKey, clientId, clientSecret } = job;

  const creds = {
    access_token: ticket.access_token,
    subscriptionKey,
    clientId,
    clientSecret
  };

  const params = {
    limit: 1
  };

  getConstituents(creds, params, (err, results={}) => {
    if (err) {
      return next(err);
    }

    const { count: totalCount, next_link: nextLink, value } = results;

    //fireUpdateJobMsg({count, next_link})
    updateJob(job.id, { totalCount, nextLink }, updateErr => {
      next(updateErr, job, value);
    });
  });
};

const processConstituents = (job, constituents, next) => {

}

const runJob = (id, cb) => {
  const getJobModel = next => getById(id, next);

  updateJob(id, {status: 'in-progress'}, err => {
    if (err) {
      return cb(err);
    }

    const pipeline = [
      getJobModel,
      validateCredentials,
      fetchConstituentList
    ];

    async.waterfall(pipeline, cb);
  });
}

function cron(onRun, onFinished, delay) {
  const startTime = new Date();
  startTime.setSeconds(startTime.getSeconds() + delay);

  return new CronJob(
    startTime,
    onRun,
    onFinished,
    true,
    'America/Los_Angeles'
  );
}

function scheduleJob(id, delay=1) {
  cron(cb => runJob(id, cb), onJobDone, delay);
}

module.exports = scheduleJob;
