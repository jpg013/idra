const CronJob   = require('cron').CronJob;
const jobRunner = require('../workers/jobRunner');

const onJobDone = err => {
  console.log('job finished with error, ' , err);
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
  cron(cb => jobRunner(id, cb), onJobDone, delay);
}

module.exports = scheduleJob;
