import callApi from '../api/call';
import { makeApiError } from '../api/makeApiError';

function authenticateUser(username, password) {
  const params = {
    body: { username, password }
  };

  return callApi('authentication', 'post', params)
    .then(resp => resp.results);
}

function isAuthTokenValid(authToken={}) {
  if (!authToken) {
    return false;
  }
  const { expiresIn, token } = authToken;

  if (!expiresIn || !token) {
    return false;
  }

  // If the expiration UTC is within 10 sec of expiration simply return false and have the user sign in again.
  return (new Date(expiresIn).getTime() < (new Date().getTime() + 10000)) ? false : true;
}

function getAuthenticatedUser() {
  return callApi('authentication/user', 'get')
    .then(resp => resp.results);
}

export {
  authenticateUser,
  isAuthTokenValid,
  getAuthenticatedUser
};
