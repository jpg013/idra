// ======================================================
// Parses errors from Twitter
// ======================================================

 const parseTwitterError = err => {
  if (!err) {
    return;
  }
  const errorCode = Array.isArray(err) ? (err[0] && err[0].code) : err.code;
  switch(errorCode) {
    case 89:
      return 'Twitter access token is invalid.'
    default:
      return
  }
}

module.exports = parseTwitterError;