const handleServiceSummaryError = (err={}, cb) => {
  const resp = {
    success: false
  };
  if (err.code === 'ECONNREFUSED') {
    resp.msg = 'service unavailable';
  }
  return cb();
};

module.exports = handleServiceSummaryError;
