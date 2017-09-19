const AUTH_TOKEN_KEY = 'INNOSOL_DOM_AUTH_TOKEN';

const getAuthTokenFromStorage = () => JSON.parse(sessionStorage.getItem(AUTH_TOKEN_KEY));
const persistAuthTokenToStorage = authToken => sessionStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(authToken));
const removeAuthTokenFromStorage = () => sessionStorage.removeItem(AUTH_TOKEN_KEY);

export {
  getAuthTokenFromStorage,
  persistAuthTokenToStorage,
  removeAuthTokenFromStorage,
};
