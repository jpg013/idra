const CronJob = require('cron').CronJob;

const scheduleCronJob = (onRun, onDone) => {
  return new CronJob(
    '*/15 * * * * *',
    onRun,
    onDone,
    true,
    'America/Los_Angeles'
  );
};

module.exports = scheduleCronJob;
