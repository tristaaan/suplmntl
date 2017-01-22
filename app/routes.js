import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import App from './pages/main';
import Home from './pages/Home';
import CollectionList from './pages/Collection';
import LinksEdit from './pages/Links/Edit';
import LinksView from './pages/Links/View';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

export default function getRoutes(store) {
  const ensureAuthenticated = (nextState, replace) => {
    if (!store.getState().auth.token) {
      replace('/login');
    }
  };
  const skipIfAuthenticated = (nextState, replace) => {
    if (store.getState().auth.token) {
      replace('/');
    }
  };
  const clearMessages = () => {
    store.dispatch({
      type: 'CLEAR_MESSAGES'
    });
  };
  return (<Router path="/" component={App}>
    <IndexRoute component={Home} onLeave={clearMessages} />
    <Route path="/login" component={Login} onEnter={skipIfAuthenticated} onLeave={clearMessages} />
    <Route path="/sign-up" component={SignUp} onEnter={skipIfAuthenticated}
      onLeave={clearMessages} />
    <Route path="/:user/collections" component={CollectionList} onLeave={clearMessages} />
    <Route path="/:user/:id/edit" component={LinksEdit} onEnter={ensureAuthenticated}
      onLeave={clearMessages} />
    <Route path="/:user/:id/view" component={LinksView} />
  </Router>);
}
