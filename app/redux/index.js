import { createStore, applyMiddleware } from 'redux';
import thunk                            from 'redux-thunk';
import reducers                         from './reducers';
import { loggedIn } from './actions/auth';
import cookie from 'react-cookie';

const store = createStore(reducers, applyMiddleware(thunk));

if (cookie.load('token')) {
  store.dispatch(loggedIn(cookie.load('token')));
}

export default store;
