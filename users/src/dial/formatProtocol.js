const formatProtocol = method => {
  switch(method) {
    case 'http-get':
      return 'get';
    case 'http-post':
      return 'post';
    case 'http-put':
      return 'put';
    case 'http-delete':
      return 'delete';
    default:
      return method;
  }
};

module.exports = formatProtocol;
