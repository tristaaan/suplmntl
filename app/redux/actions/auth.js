import moment from 'moment';
import * as service from '../../service';
import * as Actions from './actionTypes';
import history from '../../history';
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

let debounce = null;
export function authError(err) {
  if (debounce !== null) {
    clearTimeout(debounce);
    debounce = null;
  }
  debounce = setTimeout(() => {
    store.dispatch(clearError());
  }, 5000);
  return { type: Actions.AUTH_ERROR, err };
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

export function login(user, setCookie, rememberMe = false) {
  return (dispatch) => {
    service.login(user, rememberMe)
      .then((resp) => {
        if (rememberMe) {
          setCookie('token', resp.data.token, {
            expires: moment().add(5, 'days').toDate()
          });
        } else {
          setCookie('token', resp.data.token, {
            expires: moment().add(1, 'day').toDate()
          });
        }
        history.push(`/${resp.data.username}/collections`);
        dispatch(loggedIn(resp.data.token));
      })
      .catch((err) => {
        dispatch(authError(err));
      });
  };
}

export function signup(user, setCookie) {
  return (dispatch) => {
    service.signup(user)
      .then((resp) => {
        setCookie('token', resp.data.token, { expires: moment().add(1, 'hour').toDate() });
        dispatch(loggedIn(resp.data.token));
        history.push('/login');
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
      history.push('/login');
    });
}

// nothing to dispatch
export function resetPassword(newPass, token) {
  service.resetPassword(newPass, token)
    .then((resp) => {
      history.push('/login');
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

export function logout(removeCookie) {
  removeCookie('token');
  history.push('/');
  return { type: Actions.LOGOUT };
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
