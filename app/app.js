import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Main from './pages/main';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Reset from './pages/Reset';
import Forgot from './pages/Forgot';
import SignUp from './pages/SignUp';
import Account from './pages/Account';
import NotFound from './pages/NotFound';
import LinksEdit from './pages/Links/Edit';
import LinksView from './pages/Links/View';
import CollectionList from './pages/Collection'; // waterfall imports!!

import PrivateRoute from './utils/PrivateRoute';
import SkipRoute from './utils/SkipRoute';
import history from './history';

import { loggedIn } from './redux/actions/auth';

function Routes() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const [cookies] = useCookies(['token']);

  if (cookies.token && !auth.token) {
    dispatch(loggedIn(cookies.token));
  }

  /* eslint-disable  react/prop-types */
  return (
    <Router history={history}>
      <Main>
        <Switch>
          <Route
            exact
            path="/"
            component={Home} />
          <SkipRoute path="/login">
            <Login />
          </SkipRoute>
          <Route
            path="/logout"
            component={Logout} />
          <SkipRoute path="/sign-up">
            <SignUp />
          </SkipRoute>
          <PrivateRoute path="/account">
            <Account />
          </PrivateRoute>
          <SkipRoute path="/forgot">
            <Forgot />
          </SkipRoute>
          <SkipRoute path="/reset/:token">
            <Reset />
          </SkipRoute>
          <Route
            path="/:user/collections"
            component={CollectionList} />
          <PrivateRoute path="/:user/:id/edit">
            <LinksEdit />
          </PrivateRoute>
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
    </Router>
  );
}

export default Routes;
