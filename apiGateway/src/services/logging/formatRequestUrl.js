const url = require('url');

const formatRequestUrl = (host, pathname, protocol) => {
  return url.format({
    protocol,
    host,
    pathname
  });
};

module.exports = formatRequestUrl;
