import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';

function SkipRoute(props) {
  const auth = useSelector((state) => state.auth);
  const [cookies] = useCookies(['token']);

  const isAuthenticated = () => (auth.token && cookies.token);

  const { children } = props;

  const render = () => {
    if (isAuthenticated()) {
      const newPath = `/${auth.user.username}/collections`;
      return <Redirect to={newPath} />;
    }

    return children;
  };

  return (
    <Route
      path={props.path}
      render={render}
    />
  );
}

SkipRoute.propTypes = {
  path: PropTypes.string,
  children: PropTypes.object,
};

export default SkipRoute;
