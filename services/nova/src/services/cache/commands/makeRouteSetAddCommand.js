const makeSetAddKey  = require('../keys/makeRouteSetAddKey');
const makeHashMapKey = require('../keys/makeRouteHashMapKey');

const makeRouteSetAddCommand = ({url, protocol, containerName, containerPort, endpoint}) => {
  return {
    json: {
      key: makeSetAddKey(protocol, url),
      val: makeHashMapKey(protocol, containerName, containerPort, endpoint),  
    },
    protocol: 'http-post',
    endpoint: 'setadd',
    queryParams: {
      database: 'routing'
    }
  };
};

module.exports = makeRouteSetAddCommand;
