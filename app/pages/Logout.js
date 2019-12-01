import React from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';

import { logout } from '../redux/actions/auth';
import { clearCollections } from '../redux/actions/collections';

function Logout() {
  // remove cookie
  const remove = useCookies(['token'])[2];
  remove('token', { domain: document.location.hostname, path: '/' });
  // dispatch actions
  const dispatch = useDispatch();
  dispatch(clearCollections());
  dispatch(logout());
  return (
    <Redirect to="/" />
  );
}

export default Logout;
