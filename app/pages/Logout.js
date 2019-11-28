import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import { logout } from '../redux/actions/auth';
import { clearCollections } from '../redux/actions/collections';

function Logout(props) {
  const dispatch = useDispatch();
  const remove = useCookies(['token'])[2];
  // logout action
  dispatch(logout(remove, props.history));
  // clear data action
  dispatch(clearCollections());
  return (
    <Redirect to="/" />
  );
}

Logout.propTypes = {
  history: PropTypes.object,
};

export default Logout;
