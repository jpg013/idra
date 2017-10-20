const { getConstituents }   = require('../libs/sky');
const async                 = require('async');
const getById               = require('../jobs/getById');
const { validateJobTicket } = require('../libs/auth');
const saveTicket            = require('../jobs/saveTicket');
const updateJob             = require('../jobs/updateJob');
const emitJobUpdate         = require('../mq/actions/emitJobUpdate');
const processConstituent    = require('./processConstituent');

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
        return getById(job.id, next);
      });
    } else {
      next(undefined, job);
    }
  });
}

const fetchConstituentList = (job, cb) => {
  const { ticket, subscriptionKey, clientId, clientSecret } = job;

  const creds = {
    access_token: ticket.access_token,
    subscriptionKey,
    clientId,
    clientSecret
  };

  const params = {
    limit: 500
  };

  getConstituents(creds, params, (err, results) => cb(err, job, results));

  /*
  getConstituents(creds, params, (err, results={}) => {
    if (err) {
      return next(err);
    }
    //const { count: totalCount, next_link: nextLink, value } = results;

    updateJob(job.id, { totalCount, nextLink }, updateErr => {
      next(updateErr, job, value);
    });
  });
  */
};

const processConstituentList = (job, results, cb) => {
  const { value: constituents } = results;
  async.each(constituents, processConstituent, err => {
    if (err) {
      return cb(err);
    }
    return cb(err, job, results);
  });
}

const updateJobOnBatchExecuted = (job, results, cb) => {
  const { count: totalCount, next_link: nextLink, value } = results;
  const update = { totalCount, nextLink, completedCount: value.length };
  updateJob(job.id, update, updateErr => cb(updateErr, job));
}

const executeBatch = () => {
  const pipeline = [
    getJobModel,
    validateCredentials,
    fetchConstituentList,
    processConstituentList,
    updateJobOnBatchExecuted
  ];
  async.waterfall(pipeline, cb);
}

const jobRunner = (id, cb) => {
  const getJobModel = next => getById(id, next);

  const continueJob = (err, test) => {
    console.log(err);
    console.log(test);
    return false;
  }

  updateJob(id, { status: 'in-progress' }, err => {
    if (err) {
      return cb(err);
    }

    async.doWhilst(executeBatch, continueJob, cb);
  });
};

module.exports = jobRunner;
