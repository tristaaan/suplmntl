import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';

function PrivateRoute({ children, ...rest }) {
  const auth = useSelector((state) => state.auth);
  const [cookies] = useCookies(['token']);

  const isAuthenticated = () => (auth.token && cookies.token);

  const render = ({ location }) => {
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
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <Route
      {...rest}
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
