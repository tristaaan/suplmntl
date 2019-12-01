import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import * as AuthActions from '../redux/actions/auth';

import history from '../history';

class Login extends React.Component {
  sumbmitForm(e) {
    e.preventDefault();
    const user = {
      username: e.target[0].value.toLowerCase(),
      password: e.target[1].value
    };
    const rememberMe = e.target[2].value;
    this.props.dispatch(AuthActions.login(
      user,
      this.props.cookies,
      rememberMe
    ));
  }

  render() {
    return (
      <div className="login-form">
        <form onSubmit={(e) => this.sumbmitForm(e)}>
          <input type="text" placeholder="username" required />
          <input type="password" placeholder="password" required />
          <span>
            <span>
              Remember Me:
              <input type="checkbox" />
            </span>
            <Link to="/forgot">Forgot password?</Link>
          </span>
          <button type="button" onClick={() => {history.push('/sign-up');}}>Sign Up</button>
          <button type="submit">Login</button>
        </form>
        <div className={this.props.error ? 'error-box' : 'hidden'}>
          { this.props.error }
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func,
  error: PropTypes.string,
  cookies: PropTypes.object,
};

export default withCookies(connect(
  (state, ownProps) => ({
    error: state.auth.error,
    cookies: ownProps.cookies
  })
)(Login));
