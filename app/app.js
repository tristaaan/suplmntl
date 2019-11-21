import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import cookie from 'react-cookie';

import App from './pages/main';
import Home from './pages/Home';
import Login from './pages/Login';
import Reset from './pages/Reset';
import Forgot from './pages/Forgot';
import SignUp from './pages/SignUp';
import Account from './pages/Account';
import NotFound from './pages/NotFound';
import LinksEdit from './pages/Links/Edit';
import LinksView from './pages/Links/View';
import CollectionList from './pages/Collection'; // waterfall imports!!
import { resetTitle } from './utils/setTitle';

export default function getRoutes(store) {
  const ensureAuthenticated = (nextState, replace) => {
    if (!store.getState().auth.token && !cookie.load('token')) {
      replace('/login');
    }
  };
  const skipIfAuthenticated = (nextState, replace) => {
    if (store.getState().auth.token) {
      replace(`/${store.getState.auth.user.username}/collections`);
    }
  };
  // <Route path="/login/reset/:token" component={Forgot} onEnter={skipIfAuthenticated} />
  return (
    <BrowserRouter path="/" component={App}>
      <div>
        <Route exact path="/" component={Home} onLeave={resetTitle} />
        <Route path="/login" component={Login} onEnter={skipIfAuthenticated} onLeave={resetTitle} />
        <Route path="/sign-up"
          component={SignUp}
          onEnter={skipIfAuthenticated}
          onLeave={resetTitle} />
        <Route path="/:user/collections" component={CollectionList} onLeave={resetTitle} />
        <Route path="/:user/:id/edit"
          component={LinksEdit}
          onEnter={ensureAuthenticated}
          onLeave={resetTitle} />
        <Route path="/:user/:id/view" component={LinksView} />
        <Route path="/account" component={Account} onEnter={ensureAuthenticated} />
        <Route path="/forgot" component={Forgot} onEnter={skipIfAuthenticated} />
        <Route path="/reset/:token" component={Reset} onEnter={skipIfAuthenticated} />
        <Route path="*" component={NotFound} />
      </div>
    </BrowserRouter>
  );
}