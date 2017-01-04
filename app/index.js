import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { Router, hashHistory } from 'react-router';
import store from './redux';
import getRoutes from './routes';


ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory} routes={getRoutes(store)}/>
  </Provider>,
  document.getElementById('content')
);