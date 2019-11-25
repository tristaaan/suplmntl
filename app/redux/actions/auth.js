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

export function login(user, cookie, rememberMe = false) {
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
        history.push(`/${resp.data.username}/collections`);
        dispatch(loggedIn(resp.data.token));
      })
      .catch((err) => {
        dispatch(authError(err));
      });
  };
}

export function signup(user, cookies) {
  return (dispatch) => {
    service.signup(user)
      .then((resp) => {
        cookies.set('token', resp.data.token, { expires: moment().add(1, 'hour').toDate() });
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
    .then(() => {
      history.push('/login');
    });
}

// nothing to dispatch
export function resetPassword(newPass, token) {
  service.resetPassword(newPass, token)
    .then(() => {
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
    return service.changePassword(userId, oldPass, newPass)
      .then(() => dispatch(passChangeMessage()))
      .catch((err) => dispatch(authError(err)));
  };
}

export function logout(cookies) {
  cookies.remove('token');
  history.push('/');
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
