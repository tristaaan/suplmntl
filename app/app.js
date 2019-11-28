import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Main from './pages/main';
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

import { loggedIn } from './redux/actions/auth';

function Routes() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [cookies] = useCookies(['token']);

  const ensureAuthenticated = (nextState, replace) => {
    if (!auth.token && !cookies.token) {
      replace('/login');
    }
  };
  const skipIfAuthenticated = (nextState, replace) => {
    if (auth.token) {
      replace(`/${auth.user.username}/collections`);
    }
  };

  if (cookies.token && !auth.token) {
    dispatch(loggedIn(cookies.token));
  }

  /* eslint-disable  react/prop-types */
  return (
    <BrowserRouter>
      <Main>
        <Switch>
          <Route
            exact
            path="/"
            component={Home}
            onLeave={resetTitle} />
          <Route
            path="/login"
            component={Login}
            onEnter={skipIfAuthenticated}
            onLeave={resetTitle} />
          <Route
            path="/sign-up"
            component={SignUp}
            onEnter={skipIfAuthenticated}
            onLeave={resetTitle} />
          <Route
            path="/account"
            component={Account}
            onEnter={ensureAuthenticated} />
          <Route
            path="/forgot"
            component={Forgot}
            onEnter={skipIfAuthenticated} />
          <Route
            path="/reset/:token"
            component={Reset}
            onEnter={skipIfAuthenticated} />
          <Route
            path="/:user/collections"
            component={CollectionList}
            onLeave={resetTitle} />
          <Route
            path="/:user/:id/edit"
            component={LinksEdit}
            onEnter={ensureAuthenticated}
            onLeave={resetTitle} />
          <Route
            path="/:user/:id/view"
            component={LinksView} />
          <Route
            path="/:user"
            render={(props) => (
              <Redirect
                to={`${props.match.params.user}/collections`} />
            )} />
          <Route
            path="*"
            component={NotFound} />
        </Switch>
      </Main>
    </BrowserRouter>
  );
}

export default Routes;
