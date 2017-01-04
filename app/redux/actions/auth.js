import moment from 'moment';
import cookie from 'react-cookie';
import { hashHistory } from 'react-router';
import * as service from '../../service';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGOUT = 'LOGOUT';

export function loggedIn(token, user) {
  service.upadteAuthToken(token);
  return { type: LOGIN_SUCCESS, token, user };
}

export function login(user) {
  return (dispatch) => {
    service.login(user)
      .then((resp) => {
        cookie.save('token', resp.data.token, { expires: moment().add(1, 'hour').toDate() });
        dispatch(loggedIn(resp.data.token, { id: resp.data.id, username: resp.data.username }));
        hashHistory.push(`/${resp.data.username}/collections`);
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function signup(user) {
  return (dispatch) => {
    service.signup(user)
      .then((resp) => {
        cookie.save('token', json.token, { expires: moment().add(1, 'hour').toDate() });
        dispatch(loggedIn(resp.data.token, { id: resp.data.id, username: resp.data.username }));
        hashHistory.push(`/${resp.data.username}/collections`);
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function logout() {
  cookie.remove('token');
  browserHistory.push('/');
  return { type: LOGOUT };
}