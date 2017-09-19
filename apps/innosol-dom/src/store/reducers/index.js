import { combineReducers } from 'redux';
import auth from './auth';

export const makeRootReducer = () => {
  return combineReducers({
    auth
  });
};
