import { buildUserModel } from '../../factories/userFactory';
import { isAuthTokenValid } from '../../services/authService';
import initialState from '../initialState';
import {
  AUTH_SIGN_IN_REQUEST,
  AUTH_SIGN_IN_RECEIVE,
  AUTH_SIGN_IN_ERROR,
  AUTH_SIGN_OUT,
  AUTH_TOKEN_HYDRATE,
  AUTH_USER
} from '../actions/auth';

const defaultState = Object.assign({}, initialState.auth);

/*
 * Helper functions
 */
const setAuthToken = (state, authToken) => {
  if (!authToken) {
    return {
      ...state
    };
  }

  const { expiresIn, token } = authToken;

  return {
    ...state,
    status: 'authenticated',
    expiresIn,
    token
  };
};

export default function reducer(state = defaultState, action) {
  switch(action.type) {
    case AUTH_SIGN_IN_RECEIVE:
      return {
        ...state,
        ...setAuthToken(state, action.authToken)
      }
    case AUTH_SIGN_IN_ERROR:
      return {
        ...state,
        status: 'error',
        msg: action.message
      };
    case AUTH_SIGN_IN_REQUEST:
      return {
        ...state,
        status: 'authenticating',
        msg: ''
      };
    case AUTH_TOKEN_HYDRATE:
      if (isAuthTokenValid(action.authToken)) {
        return {
          ...state,
          ...setAuthToken(state, action.authToken),
        };
      } else {
        return {
          ...state
        };
      }
    case AUTH_SIGN_OUT:
      return {
        ...defaultState
      };
    case AUTH_USER:
      return {
        ...state,
        user: buildUserModel(action.user)
      }
    default:
      return state;
  }
}
