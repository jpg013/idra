const immutable = require('immutable');

/* Map of all current connections */
let connectionMap = immutable.Map();
/* Map of all identified connections */
let userConnectionMap = immutable.Map();

let rooms = immutable.Map({
  'ADMIN_TEAM_PROFILE' : immutable.Map()
});

const roomRestrictions = immutable.Map({
  "ADMIN_TEAM_PROFILE": [user => user.isAdmin],
});

/**
 * Factory returns object that exposes connectionMap and userConnection map
 */
const buildConnectionStore = () => {
  const canUserJoinRoom = (room, userModel) => {
    const restrictions = roomRestrictions.get(room);
    if (!restrictions) return true; 
    return !restrictions.find(fn => !fn(userModel));
  }

  const addConnection = conn => {
    if (!conn) { return; }
    connectionMap = connectionMap.set(conn.id, conn);
  }

  const identifyConnection = (userId, connId) => {
    if (!connectionMap.get(connId)) { return; }
    userConnectionMap = userConnectionMap.set(userId, connId);
  }

  const removeConnection = connId => {
    console.log('remove connections');
    connectionMap = connectionMap.delete(connId);
    const userId = userConnectionMap.findKey(cur => cur == connId);
    if (!userId) {
      return;
    }
    userConnectionMap = userConnectionMap.delete(userId);
    removeUserFromAllRooms(userId);
  }

  const getClientSocket = userId => {
    if (!userId) { return; }
    const connId = userConnectionMap.get(userId);
    return connId ? connectionMap.get(connId) : undefined;
  }

  const getConnectedClientList = () => {
    return userConnectionMap.keySeq().toJS();
  }

  const joinAdminTeamProfileRoom = (userModel, teamId) => {
    if (!userModel || !userModel.isAdmin || !teamId) return;
    rooms = rooms.updateIn(['ADMIN_TEAM_PROFILE', teamId], val => {
      val = val ? val : immutable.Set();
      return val.contains(userModel.id) ? val : val.add(userModel.id)
    });
  }

  const leaveAdminTeamProfileRoom = userId => {
    if (!userId) return;
    rooms = rooms.update('ADMIN_TEAM_PROFILE', val => {
      return val.keySeq().toList().reduce((acc, cur) => {
        return acc.set(cur, val.get(cur).delete(userId));
      }, immutable.Map());
    });
  }
  
  const joinRoom = (roomName, opts={}) => {
    const { userModel } = opts;
    if (!roomName || !userModel) { return; }
    
    if (!canUserJoinRoom(roomName, userModel)) { return; }
    
    switch(roomName) {
      case 'ADMIN_TEAM_PROFILE':
        const {teamId} = opts;
        return teamId ? joinAdminTeamProfileRoom(userModel, teamId) : undefined;
      default:
        return;
    }
  }

  const getConnectedRoomSockets = (roomName, opts={}) => {
    if (!roomName) return;
    const userList = getRoomUserList(roomName, opts);
    if (!userList) return;

    // Map the user ids to connected clients
    return userList
      .toList()
      .map(cur => getClientSocket(cur))
      .filter(cur => !!cur);
  }

  const getRoomUserList = (roomName, opts={}) => {
    switch(roomName) {
      case 'ADMIN_TEAM_PROFILE':
        return getAdminTeamProfileRoomUsers(opts);
      default:
        return;
    }
  }

  const getAdminTeamProfileRoomUsers = ({teamId}) => {
    if (!teamId) return;
    return rooms.getIn(['ADMIN_TEAM_PROFILE', teamId]);
  }

  const leaveRoom = (roomName, opts={}) => {
    const {userId} = opts;
    if (!roomName || !userId) { return; }
    console.log('leaving rooms!');
    switch(roomName) {
      case 'ADMIN_TEAM_PROFILE':
        return leaveAdminTeamProfileRoom(userId);
      default:
        return;
    }
  }

  const removeUserFromAllRooms = userId => {
    console.log(rooms);
    leaveRoom('ADMIN_TEAM_PROFILE', {userId});
    console.log(rooms);
  }
 
  return {
    addConnection,
    identifyConnection,
    removeConnection,
    joinRoom,
    leaveRoom,
    getClientSocket,
    getConnectedClientList,
    getConnectedRoomSockets
  }
}

/**
 * Get store instance
 */
module.exports = buildConnectionStore();