import moment from 'moment';

/**
 * User States
 */
const modelStates = {
  dirty: 'dirty',
  persisting: 'persisting',
  pristine: 'pristine',
  new: 'new'
};

const userModel = {
  type: 'user',
  email: '',
  firstName: '',
  lastName: '',
  createdDate: '',
  formattedCreatedDate: undefined,
  formattedLastLoginDate: undefined,
  lastLoginDate: '',
  role: '',
  team: ''
};

/**
 * Creates a completely new, non-persisted user map
 */

const buildUserModel = data => {
  const createdDate = new Date(data.createdDate);
  const lastLoginDate = data.lastLoginDate ? new Date(data.lastLoginDate) : undefined;
  const formattedCreatedDate = moment(createdDate).format('MMMM Do, YYYY');
  const formattedLastLoginDate = lastLoginDate ? moment(lastLoginDate).format('MMMM Do YYYY, h:mm a') : undefined;

  const dataMap = {
   ...data,
    createdDate,
    formattedCreatedDate,
    lastLoginDate,
    formattedLastLoginDate
  };

  return {
    ...userModel,
    ...dataMap,
    state: modelStates.pristine
  };
};


export {
  buildUserModel,
};
