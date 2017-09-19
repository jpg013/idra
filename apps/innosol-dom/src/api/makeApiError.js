export const makeApiError = (code, msg) => {
  const err = new Error();
  err.status = code;
  err.message = msg;
  return err;
};
