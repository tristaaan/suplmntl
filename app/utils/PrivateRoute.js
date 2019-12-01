import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';

function PrivateRoute(props) {
  const auth = useSelector((state) => state.auth);
  const [cookies] = useCookies(['token']);

  const isAuthenticated = () => (auth.token && cookies.token);

  const { children, location } = props;

  const render = () => {
    if (isAuthenticated()) {
      return children;
    }

    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: location }
        }}
      />
    );
  };
  return (
    <Route
      path={props.path}
      render={render}
    />
  );
}

PrivateRoute.propTypes = {
  path: PropTypes.string,
  children: PropTypes.object,
  location: PropTypes.object,
};

export default PrivateRoute;
