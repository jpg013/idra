const initialState = {
  auth : {
    user: undefined,
    token: undefined,
    tokenExpirationDate: undefined,
    status: 'initial',  // intitial, authenticating, error, authenticated
    msg: '' // error messages, etc...
  }
};

export default initialState;
