const AuthTokenClient = require('../common/auth-token');
const async           = require('async');
const SocketStore     = require('./socket-store');
const UserService     = require('../services/user.service');
const SocketWrite     = require('./socket-write');
const ioEvents        = require('./io-events');

function identifyConnection(payload) {
  const { authToken, socket } = payload;
  if (!authToken || !socket) return;
  const pipeline = [
    cb => AuthTokenClient.verifyToken(authToken, cb),
    (token, cb) => UserService.findUser(token.id, cb),
    (userModel, cb) => {
      if (!userModel) return cb('missing required user model');
      SocketStore.identifyConnection(userModel.id, socket.id);
      UserService.updateUserModel(userModel.id, {'lastLoginDate': new Date()}, cb);
    }
  ];
  
  async.waterfall(pipeline, (err, userModel) => {
    if (err || !userModel) { return; }
    syncUser(userModel);
  });
};

function syncUser(userModel) {
  if (!userModel) { return; }
  const conn = SocketStore.getClientSocket(userModel.id);
  if (!conn) { return; }
  console.log('writing to the fucking socket!');
  console.log(userModel.clientProps);
  SocketWrite(conn, ioEvents.syncUser, userModel.clientProps);
};

function config(socketEmitter) {
  socketEmitter.on(ioEvents.identifySocket, identifyConnection);
  socketEmitter.on(ioEvents.createReport, onCreateReport);
}

function onCreateReport(reportModel) {
  if (!reportModel) return;
  UserService.getUsersForTeam(reportModel.teamId, (err, results=[]) => {
    if (err || !results.length) return;
    console.log(results);
    results.forEach(cur => syncUser(cur));    
  });
}

module.exports = {
  config
};
