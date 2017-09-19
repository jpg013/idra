import { API_ERROR } from '../actions/api';
import { signOut } from '../actions/auth';

function apiErrorMiddleware(state) {
  return dispatch => next => action => {
    if (action.type === API_ERROR) {
      switch(action.error.status) {
        case 401:
          signOut();
          break;
        default:
          break;
      }
    }
    return next(action);
  };
}

export default apiErrorMiddleware();
