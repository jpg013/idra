import {
  AUTH_TOKEN_HYDRATE,
  AUTH_SIGN_IN_RECEIVE,
  AUTH_SIGN_OUT
} from '../actions/auth';

import { isAuthTokenValid } from '../../services/authService';

import {
  getAuthTokenFromStorage,
  persistAuthTokenToStorage,
  removeAuthTokenFromStorage
} from '../../services/storageService';

function authTokenMiddleware(state) {
  return dispatch => next => action => {
    if (action.type === AUTH_TOKEN_HYDRATE) {
      // Attempt to hydrate user session data from storage
      const authToken = getAuthTokenFromStorage();
      if (isAuthTokenValid(authToken)) {
        action.authToken = authToken;
      } else {
        // Remove session for good measure
        removeAuthTokenFromStorage();
      }
    } else if (action.type === AUTH_SIGN_IN_RECEIVE) {
      persistAuthTokenToStorage(action.authToken);
    } else if (action.type === AUTH_SIGN_OUT) {
      removeAuthTokenFromStorage();
    }
    return next(action);
  };
}

export default authTokenMiddleware();
