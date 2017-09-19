import makeActionCreator from './makeActionCreator';

export const API_ERROR = 'API_ERROR';
export const apiError = makeActionCreator(API_ERROR, 'error');
