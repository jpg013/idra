const TwitterIntegrationFactory  = require('../factories/twitter-integration.factory');
const TwitterIntegrationJobModel = require('../models/twitter-integration-job.model');
const Idra                       = require('./idra.js');
const Jinro                      = require('./jinro.js');

function getLastIntegrationJob(teamId, cb) {
  if (!teamId) return cb('missing required team id');
  const $query = {teamId};
  const $sort = {timestamp: 1}
  const $fields = {
    createdTimestamp: 1,
    completedCount: 1,
    status: 1,
    teamId: 1,
    statusMsg: 1,
    inProcess: 1
  };

  TwitterIntegrationJobModel
    .find($query, $fields)
    .sort($sort)
    .limit(1)
    .exec(function(err, results=[]) {
      const integrationJob = results[0];
      if (err) return cb(err);
      return integrationJob ? cb(err, integrationJob) : cb(err, undefined);
    })
}

function createIntegrationJob(teamModel, cb) {
  if (!teamModel) return cb('There was an error starting the twitter integration.');

  /* Call out to idra to get the user list to integrate */
  Idra.getTwitterScreenNames(teamModel.neo4jCredentials, function(err, results = []) {
    if (err) {
      return cb('there was an error getting Twitter integration user list');
    }
    const userList = results.map(cur => Object.assign({}, cur, { followers: [], friends: [] }));
    const integrationData = {
      teamId: teamModel.id,
      neo4jCredentials: teamModel.neo4jCredentials,
      userList
    };
    const scrubbedFields = TwitterIntegrationFactory.scrubTwitterIntegrationData(integrationData);
    if (!TwitterIntegrationFactory.validateTwitterIntegrationFields(scrubbedFields)) {
      return cb('There was an error starting the twitter integration.');
    }
    const twitterIntegrationJobModel = TwitterIntegrationFactory.buildTwitterIntegrationJobModel(scrubbedFields);
    twitterIntegrationJobModel.save(err => {
      if (err) return cb(err);
      // Kick off the pending job
      //Jinro.runPendingTwitterIntegrationJobs();
      cb(err, twitterIntegrationJobModel.clientProps);
    })
  });
}

function getRunningTwitterIntegrationJob(teamId, cb) {
  const $query = {teamId,  status: {'$ne': 'finished'}};
  const $proj = {
    createdTimestamp: 1,
    completedCount: 1,
    status: 1,
    teamId: 1,
    statusMsg: 1,
    inProcess: 1
  };

  TwitterIntegrationJobModel
    .findOne($query, $proj)
    .exec((err, results) => cb(err, results));    
}

module.exports = {
  getLastIntegrationJob,
  createIntegrationJob,
  getRunningTwitterIntegrationJob
}