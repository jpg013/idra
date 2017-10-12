const find           = require('../../db/jobs/find');
const mapClientProps = require('../../db/jobs/mapClientProps');
const async          = require('async');
const scheduleJob    = require('./scheduleJob');

const runPendingJobs = () => {
  const $query = { status: 'pending' };
  const $proj = { _id: 1 };

  find($query, $proj, (err, results=[]) => {
    if (err) {
      return;
    }

    const ids = results.map(cur => cur._id.toString());

    ids.forEach((cur, i) => {
      scheduleJob(cur, (i + 1) * 5);
    });
  });
}

module.exports = runPendingJobs;
