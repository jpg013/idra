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
  SocketWrite(conn, ioEvents.syncUser, userModel.clientProps);
};

function config(socketEmitter) {
  socketEmitter.on(ioEvents.identifySocket, identifyConnection);
}

module.exports = {
  config
};
