const AuthTokenClient = require('../common/authToken');
const async           = require('async');
const SocketStore     = require('./socketStore');
const UserService     = require('../services/userService');
const SocketWrite     = require('./socketWrite');
const ioEvents        = require('./ioEvents');

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
    onSyncUser(userModel);
  });
};

function onSyncUser(userModel) {
  if (!userModel) { return; }
  const conn = SocketStore.getClientSocket(userModel.id);
  if (!conn) { return; }
  SocketWrite(conn, ioEvents.syncUser, userModel.clientProps);
};

function onCreateReport(reportModel) {
  if (!reportModel) return;
  UserService.getUsersForTeam(reportModel.teamId, (err, results=[]) => {
    if (err || !results.length) return;
    results.forEach(cur => onSyncUser(cur));
  });
}

function config(socketEmitter) {
  socketEmitter.on(ioEvents.identifySocket, identifyConnection);
  socketEmitter.on(ioEvents.createReport, onCreateReport);
  socketEmitter.on(ioEvents.syncUser, onSyncUser);
}

module.exports = {
  config
};
