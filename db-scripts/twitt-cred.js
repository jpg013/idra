const TwitterCredential = require('../models/twitter-credential.model');
const async             = require('async');
const dotenv            = require('dotenv');

/**
 * Load in config file  
 */

dotenv.config();

/**
 * Init the mongo connection
 */

require('../config/mongo').config();

/*
TwitterCredential.update({consumer_key: '3e14ca0da1f7a86407b9765dbc48fc427147f31c1f56171b8f'}, {$set: {lockedUntil: 1493918403802}}, function(err, results) {
  console.log(err);
  console.log(results);
});

TwitterCredential.update({consumer_key: '133a853d83afb33330cd6e6cf741e956315dac7f3d764728bc'}, {$set: {lockedUntil: 1493921103802}}, function(err, results) {
  console.log(err);
  console.log(results);
});

*/

// Query all accessible credentials not in use
  const $query = {
    '$and': [
      { '$or': [ {teamId: '590b5ea230e37c698a31b399'}, {isPublic: true} ] },
      { 'inUse': { $eq: false }},
    ]
  }
  // Sort them by locked until    
  const $sort = { lockedUntil: 1 };
  
  TwitterCredential
    .find($query)
    .sort($sort)
    .exec(function(err, results=[]) {
      if (err) return cb(err);
      if (!results.length) {
        console.log('what the fuck!!!!');
      } else {
        console.log('xxxxxxxxxx');
        results.forEach(cur => console.log(cur));
      }
    })