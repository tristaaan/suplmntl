import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';

function SkipRoute({ children, ...rest }) {
  const auth = useSelector((state) => state.auth);
  const [cookies] = useCookies(['token']);

  const isAuthenticated = () => (auth.token && cookies.token);

  const render = ({ location }) => {
    if (isAuthenticated()) {
      if (location) {
        const newPath = location.state.from;
        return <Redirect to={newPath} />;
      }
      const newPath = `/${auth.user.username}/collections`;
      return <Redirect to={newPath} />;
    }

    return children;
  };
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <Route
      {...rest}
      render={render}
    />
  );
}

SkipRoute.propTypes = {
  path: PropTypes.string,
  children: PropTypes.object,
};

export default SkipRoute;
