import { call, put, takeLatest } from 'redux-saga/effects';
import {
  AUTH_SIGN_IN_REQUEST,
  AUTH_TOKEN_HYDRATE,
  signInError,
  signInReceive,
  setAuthenticatedUser
} from '../store/actions/auth';
import { authenticateUser, getAuthenticatedUser } from '../services/authService';

function *signInRequest(action={}) {
  const authResp = yield call(authenticateUser, action.username, action.password);

  if (!authResp.success) {
    yield put(signInError(authResp.msg));
    return;
  }

  const { token, expiresIn } = authResp;

  if (!token) {
    yield put(signInError('Error signing in.'));
    return;
  }

  const authToken = {
    expiresIn,
    token
  };

  yield put(signInReceive(authToken));

  const { user } = yield call(getAuthenticatedUser);

  if (user) {
    yield put(setAuthenticatedUser(user));
  }
}

function *authSaga() {
  yield takeLatest(AUTH_SIGN_IN_REQUEST, signInRequest);

}

export default authSaga;
