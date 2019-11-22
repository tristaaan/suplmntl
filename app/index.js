import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { useCookies } from 'react-cookie';
import store from './redux';
import App from './app';
import { loggedIn } from './redux/actions/auth';

const [cookies] = useCookies(['token']);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('content'),
  () => {
    if (cookies.token) {
      store.dispatch(loggedIn(cookies.token));
    }
  }
);
