const async                 = require('async');
const scheduleCronJob       = require('./services/scheduleCronJob');
const dialServiceSummary    = require('./services/dialServiceSummary');
const getServiceDefinitions = require('./services/getServiceDefinitions');

const run = () => {
  const cronJobRunHandler = cb => {
    getServiceDefinitions((err, definitions=[]) => {
      if (err) {
        return cb(err);
      }
      
      async.eachSeries(definitions, (item, callback) => {
        dialServiceSummary(item, callback);
      }, () => {
        cb();
      });
    });
  };

  const cronJobFinishedHandler = err => {
    console.log('finished with cron job with err, ', err);
  };
  
  scheduleCronJob(cronJobRunHandler, cronJobFinishedHandler);
};


module.exports = run;
