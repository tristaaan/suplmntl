import { combineReducers } from 'redux';

import auth from './auth';
import collections from './collections';

export default combineReducers({
  auth,
  collections
});
