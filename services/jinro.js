'use strict';

/**
 * Module dependencies.
 */

const dotenv  = require('dotenv');
const http    = require('http');
const Twitter = require('twitter');

/**
 * Read environment config
 */
dotenv.config();

/**
 * Create HTTPS Server
 */
const httpServer = http.createServer((req, res) => {
  console.log('https server getting request');
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('okay');
});

httpServer.listen(process.env.PORT);

const client = new Twitter({
  consumer_key: 'hI5fn9Ufx9VSxLSSuyk0iV3gw',
  consumer_secret: 'mBuEciuGcZ37kuJvgCd0m1MR1ltFfhVBO9vQDsZECQlLBdfQ99',
  access_token_key: '3832567466-uubk9xCWTOgyo4zfXQ97ix5xXEfXENBm2sQe275',
  access_token_secret: 'wVzPuMEveeVGwjmLEHVJTdqmL0v3GjHvDrHua36KgpzGE'
});

var params = {screen_name: 'JustinGraber'};


/*
client.get('users/lookup', params, function(error, resp) {
  client.get('friends/list', {user_id: resp[0].id}, function(err, resp) {
    console.log(err);
    console.log(resp);
  })
});

*/
