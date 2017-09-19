const dial                = require('../dial');
const async               = require('async');

const callServiceRouteEndpoints = (serviceRouteModel, opts, cb) => {
  const baseOptions = {
    serviceName: serviceRouteModel.serviceName,
    containerPort: serviceRouteModel.containerPort,
    queryParams: opts.queryParams,
    json: opts.json,
    requestMethod: serviceRouteModel.requestMethod
  };
  
  const dialEndpoint = (endpoint, next) => {
    // TODO: handle endpoint authorization
    const dialOptions = Object.assign({}, baseOptions, { endpoint });
    dial(dialOptions, next);
  };
  
  async.each(serviceRouteModel.endpoints, dialEndpoint, cb);
};

module.exports = callServiceRouteEndpoints;
