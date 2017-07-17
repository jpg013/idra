const express                   = require('express')
const AuthMiddleware            = require('../middleware/auth');
const TeamService               = require('../services/teamService');
const IntegrationService        = require('../services/integrationService');
const async                     = require('async');
const Idra                      = require('../services/idra');
const Jinro                     = require('../services/jinro/index');

/**
 *  Declare Express Controller
 */
const TeamProfileController = express.Router();

function getTeamProfile(req, res, next) {
  const name = req.query.name;
  if (!name) {
    req.err = 'invalid team name';
    next();
  }

  const onResults = (err, results) => {
    if (err) {
      req.err = err;
      next();
    }
    req.results = results;
    next();
  }  
  
  const getDetails = cb => {
    TeamService.getTeamByName(name, (err, teamModel) => {
      if (err) {
        cb(err);
      }
      if (!teamModel) {
        return cb(undefined, 'there was an error getting team profile details');
      }

      return cb(undefined, Object.assign({}, teamModel.clientProps));
    });
  }

  const getIntegrations = (results={}, cb) => {
    IntegrationService.getIntegrationsForTeam(results.id, (err, integrations) => {
      if (err) {
        return cb(err);
      }
      results.integrations = integrations;
      return cb(undefined, results);
    });
  }

  async.waterfall([getDetails, getIntegrations], onResults);
}

function createIntegration(req, res, next) {
  if (!req.adminUser || !req.adminUser.isAdmin) {
    req.error = 'must be an admin to run integration';
    return next();
  }

  const {teamId, type} = req.body;
  
  if (!teamId || !type) {
    req.error = 'invalid integration data'
    return next();
  }

  const onResults = (err, integrationModel) => {
    if (err) {
      req.error = err;
      return next();
    }
    req.results = integrationModel;
    Jinro.runPendingIntegrations();
    next();
  }
  
  const getTeam = cb => {
    TeamService.findTeam(teamId, function(err, teamModel) {
      if (err) {
        cb(err)
      }
      
      if (!teamModel) {
        return cb('could not find user team');
      }
      
      const neo4jCredentials = teamModel.neo4jCredentials;
      
      if (!teamModel.neo4jCredentials) {
        return cb('invalid neo4j credentials');
      }

      if (!teamModel.twitterCredential) {
        return cb('invalid twitter credential');
      }

      return cb(undefined, {teamModel});
    });
  }

  const checkForActiveIntegration = (results, cb) => {
    IntegrationService.getActiveIntegrationsForTeam(results.teamModel.id, type, (err, activeIntegration) => {
      if (err) {
        return cb(err);
      }
      if (activeIntegration) {
        return cb(`a ${type} integration is already in progress`);
      }
      return cb(undefined, results);
    });
  } 

  const getIntegrationUsers = (results, cb) => {
    Idra.getTwitterScreenNames(results.teamModel.neo4jCredentials, (err, screenNames) => {
      if (err) {
        return cb(err);
      }
      results.userList = screenNames.map(cur => {
        const { name, id, twitterID } = cur;
        return {
          name,
          id,
          screenName: twitterID,
          followers: [],
          friends: []
        }
      }).slice(0, 10);
      return cb(err, results);
    });
  }

  const createModel = (results, cb) => {
    const integrationData = {
      teamId: results.teamModel.id,
      type,
      createdById: req.adminUser.id,
      createdByName: `${req.adminUser.firstName} ${req.adminUser.lastName}`,
      userList: results.userList,
      totalCount: results.userList.length,
      socialMediaCredential: results.teamModel.twitterCredential.clientProps
    };
    IntegrationService.createIntegration(integrationData, (err, model) => cb(err, model));
  }

  async.waterfall([getTeam, checkForActiveIntegration, getIntegrationUsers, createModel], onResults);
}

function saveTwitterCredential(req, res) {
  const twitterCredentialModel = req.body.twitterCredentialModel;
  if (!twitterCredentialModel) {
    return res.status(400).send({err: 'Missing twitter integration model'});
  }
  TeamService.saveTwitterCredential(twitterCredentialModel, (err, twitterCredential) => {
    if (err) {
      return res.status(500).send({err});
    }
    return res.status(200).send({results: twitterCredential.clientProps});
  });
}

const errorHandler = err => {
    if (err === 'Twitter integration currently in progress for user team.' ||
        err === 'No valid Twitter credentials found for user team.') {
      return res.status(200).send({success: false, msg: err});
    } else {
      return res.status(500).send({success: false, msg: 'There was an error while starting Twitter Integration for user team.'});
    }
  }

function errorResponseHandler(error, res) {
  if (!res) {
    return;    
  }
  return res.status(500).send({error});
}

function responseHandler(req, res) {
  const { error, results} = req;
  if (error) {
    return errorResponseHandler(error, res);
  }
  return res.status(200).send({results});
}

/**
 * Controller Routes
 */
TeamProfileController.get('/', AuthMiddleware.isAdmin, getTeamProfile, responseHandler);
TeamProfileController.post('/twittercredential', AuthMiddleware.populateUser, saveTwitterCredential);
TeamProfileController.post('/integration', AuthMiddleware.isAdmin, createIntegration, responseHandler);

module.exports = TeamProfileController;
