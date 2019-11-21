import { createStore, applyMiddleware } from 'redux';
import { useCookies } from 'react-cookie';
import thunk from 'redux-thunk';

import reducers from './reducers';
import { loggedIn } from './actions/auth';

const store = createStore(reducers, applyMiddleware(thunk));
const [cookies] = useCookies(['token']);

if (cookies.token) {
  store.dispatch(loggedIn(cookies.token));
}

export default store;
