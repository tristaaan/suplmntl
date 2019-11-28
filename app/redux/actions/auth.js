import moment from 'moment';
import * as service from '../../service';
import * as Actions from './actionTypes';
import store from '..';

function loginSuccess(token, user) {
  return { type: Actions.LOGIN_SUCCESS, token, user };
}

function updateUser(user) {
  return { type: Actions.UPDATE_USER, user };
}

export function clearError() {
  return { type: Actions.CLEAR_ERROR };
}

export function clearMessage() {
  return { type: Actions.CLEAR_MESSAGE };
}

export function passChangeMessage() {
  return (dispatch) => {
    dispatch({
      type: Actions.PASS_CHANGE,
      message: 'Password successfully updated.',
    });
    setTimeout(
      () => { dispatch(clearMessage()); },
      3500
    );
  };
}

let debounce = null;
export function authError(err) {
  return (dispatch) => {
    dispatch({ type: Actions.AUTH_ERROR, err });
    if (debounce !== null) {
      clearTimeout(debounce);
      debounce = null;
    }
    debounce = setTimeout(() => {
      debounce = null;
      console.log('dispatch clear');
      store.dispatch(clearError());
    }, 3500);
  };
}

export function loggedIn(token) {
  service.updateAuthToken(token);
  return (dispatch) => {
    service.getUser()
      .then((resp) => {
        dispatch(loginSuccess(token, resp.data));
      })
      .catch((err) => authError(err));
  };
}

export function login(user, cookie, location, rememberMe = false) {
  return (dispatch) => {
    service.login(user, rememberMe)
      .then((resp) => {
        if (rememberMe) {
          cookie.set('token', resp.data.token, {
            expires: moment().add(5, 'days').toDate()
          });
        } else {
          cookie.set('token', resp.data.token, {
            expires: moment().add(1, 'day').toDate()
          });
        }
        location.push(`/${resp.data.username}/collections`);
        dispatch(loggedIn(resp.data.token));
      })
      .catch((err) => {
        dispatch(authError(err));
      });
  };
}

export function signup(user, cookies, location) {
  return (dispatch) => {
    service.signup(user)
      .then((resp) => {
        cookies.set('token', resp.data.token, { expires: moment().add(1, 'hour').toDate() });
        dispatch(loggedIn(resp.data.token));
        location.push('/login');
      })
      .catch((err) => {
        console.log(err);
        dispatch(authError(err));
      });
  };
}

export function forgotPassword(email, location) {
  return () => {
    service.forgotPassword(email)
      .then(() => {
        location.push('/login');
      });
  };
}

export function resetPassword(newPass, token, location) {
  return () => {
    service.resetPassword(newPass, token)
      .then(() => {
        location.push('/login');
      });
  };
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
  return (dispatch) => service.changePassword(userId, oldPass, newPass)
    .then(() => dispatch(passChangeMessage()))
    .catch((err) => dispatch(authError(err)));
}

export function logout(removeCookie, location) {
  removeCookie('token');
  location.push('/');
  return { type: Actions.LOGOUT };
}

export function deleteAccount(userId, cookies) {
  return (dispatch) => {
    service.deleteAccount(userId)
      .then(() => {
        dispatch(logout(cookies));
      })
      .catch((err) => {
        console.log(err);
        return authError(err);
      });
  };
}
