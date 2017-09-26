const makeRouteHashMapGetCommand = (key) => {
  return {
    protocol: 'http-get',
    endpoint: 'hashmapget',
    queryParams: {
      database: 'routing',
      key
    }
  }
};

module.exports = makeRouteHashMapGetCommand;
