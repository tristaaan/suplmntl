import moment from 'moment';
import cookie from 'react-cookie';
import { hashHistory } from 'react-router';
import * as service from '../../service';
import store from '../';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const AUTH_ERROR = 'AUTH_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';
export const LOGOUT = 'LOGOUT';
export const UPDATE_USER = 'UPDATE_USER';
export const FORGOT = 'FORGOT';
export const RESET = 'RESET';

function loginSuccess(token, user) {
  return { type: LOGIN_SUCCESS, token, user };
}

function updateUser(user) {
  return { type: UPDATE_USER, user };
}

export function clearError() {
  return { type: CLEAR_ERROR };
}

let debounce = null;
export function authError(err) {
  if (debounce !== null) {
    clearTimeout(debounce);
    debounce = null;
  }
  debounce = setTimeout(() => {
    store.dispatch(clearError());
  }, 5000);
  return { type: AUTH_ERROR, err };
}

export function loggedIn(token) {
  service.upadteAuthToken(token);
  return (dispatch) => {
    service.getUser()
      .then((resp) => {
        dispatch(loginSuccess(token, resp.data));
      })
      .catch((err) => {
        return authError(err);
      });
  };
}

export function login(user, rememberMe = false) {
  return (dispatch) => {
    service.login(user, rememberMe)
      .then((resp) => {
        if (rememberMe) {
          cookie.save('token', resp.data.token, { expires: moment().add(5, 'days').toDate() });
        } else {
          cookie.save('token', resp.data.token, { expires: moment().add(1, 'day').toDate() });
        }
        hashHistory.push(`/${resp.data.username}/collections`);
        dispatch(loggedIn(resp.data.token));
      })
      .catch((err) => {
        dispatch(authError(err));
      });
  };
}

export function signup(user) {
  return (dispatch) => {
    service.signup(user)
      .then((resp) => {
        cookie.save('token', resp.data.token, { expires: moment().add(1, 'hour').toDate() });
        dispatch(loggedIn(resp.data.token));
        hashHistory.push('/login');
      })
      .catch((err) => {
        console.log(err);
        dispatch(authError(err));
      });
  };
}

// nothing to dispatch
export function forgotPassword(email) {
  service.forgotPassword(email)
    .then((resp) => {
      hashHistory.push('/login');
    });
}

// nothing to dispatch
export function resetPassword(newPass, token) {
  service.resetPassword(newPass, token)
    .then((resp) => {
      hashHistory.push('/login');
    });
}

export function updateUserEmail(userId, newEmail) {
  return (dispatch) => {
    service.updateEmail(userId, newEmail)
      .then((resp) => {
        dispatch(updateUser(resp.data));
      });
  };
}

export function changePassword(userId, oldPass, newPass) {
  return (dispatch) => {
    service.changePassword(userId, oldPass, newPass)
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        console.log(err);
        return authError(err);
      });
  };
}

export function logout() {
  cookie.remove('token');
  hashHistory.push('/');
  return { type: LOGOUT };
}

export function deleteAccount(userId) {
  return (dispatch) => {
    service.deleteAccount(userId)
      .then((resp) => {
        dispatch(logout());
      })
      .catch((err) => {
        console.log(err);
        return authError(err);
      });
  };
}
