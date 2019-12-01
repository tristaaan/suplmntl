import React from 'react';
import { Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';

import { logout } from '../redux/actions/auth';

function Logout() {
  const dispatch = useDispatch();
  const remove = useCookies(['token'])[2];
  // logout action
  dispatch(logout(remove));
  return (
    <Redirect to="/" />
  );
}

export default Logout;
