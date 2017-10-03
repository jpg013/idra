const makeSetAddKey  = require('../keys/makeRouteSetAddKey');

const makeRouteSetMembersComamnd = key => {
  return {
    protocol: 'http-get',
    endpoint: 'setmembers',
    queryParams: {
      database: 'routing',
      key
    }
  };
};

module.exports = makeRouteSetMembersComamnd;
