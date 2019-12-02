import React from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';

import { logout } from '../redux/actions/auth';
import { clearCollections } from '../redux/actions/collections';

function Logout() {
  // remove cookie
  const remove = useCookies(['token'])[2];
  const domain = process.env.NODE_ENV === 'production'
    ? document.location.origin
    : document.location.hostname;
  remove('token', {
    domain,
    path: '/',
  });
  // dispatch actions
  const dispatch = useDispatch();
  dispatch(clearCollections());
  dispatch(logout());
  return (
    <Redirect to="/" />
  );
}

export default Logout;
