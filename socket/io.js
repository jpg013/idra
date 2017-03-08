const authToken  = require("../common/auth-token");
const user       = require("../models/user.model.js");
const immutable  = require("immutable");
const async      = require("async");
const sockStore  = require('./sock-store');
const sockEvents = require('./sock-events');
const rooms      = require('./rooms/index');

const onIdentifyConnection = (data) => {
  const tokenString = data.payload;
  const socket = data.socket;
  const pipeline = [
    cb => authToken.verifyTokenAndReturnUser(tokenString, cb),
    (userModel, cb) => {
      if (!userModel) { return cb(); }
      sockStore.identifyConnection(userModel.id, socket.id);
      // update the last login date
      user.findOneAndUpdate({_id: userModel._id}, {$set: {'lastLogin': new Date()}}, {new: true})
        .populate('team')
        .exec(cb);
    },
    (userModel, cb) => {
      sockEvents.emit(sockEvents.e.syncUser, userModel);
      cb();
    }
  ];
  async.waterfall(pipeline, (err) => {
    if (err) { return; }
  });
}

const onSyncUser = userModel => {
  if (!userModel) { return; }
  const conn = sockStore.getClientSocket(userModel.id);
  if (!conn) { return; }
  
  const payload = {
    event: sockEvents.e.syncUser,
    payload: userModel.clientProps
  };
  conn.write(JSON.stringify(payload));  
};


const config = () => {
  sockEvents.attachEventListener(sockEvents.e.identifyConnection, onIdentifyConnection);
  sockEvents.attachEventListener(sockEvents.e.syncUser, onSyncUser)

  rooms.config();
};

module.exports = {
  config
};