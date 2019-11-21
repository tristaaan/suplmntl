import React from 'react';
import PropTypes from 'prop-types';
import { hashHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import * as AuthActions from '../redux/actions/auth';

class Login extends React.component {
  sumbmitForm(e) {
    e.preventDefault();
    const user = {
      username: e.target[0].value,
      password: e.target[1].value
    };
    const rememberMe = e.target[2].value;
    this.props.dispatch(AuthActions.login(user, rememberMe));
  }

  static gotoSignUp() {
    hashHistory.push('/sign-up');
  }

  render() {
    return (
      <div className="login-form">
        <form onSubmit={this.sumbmitForm}>
          <input type="text" placeholder="username" required />
          <input type="password" placeholder="password" required />
          <span>
            <span>
              Remember Me:
              <input type="checkbox" />
            </span>
            <Link to="/forgot">Forgot password?</Link>
          </span>
          <button type="button" onClick={this.gotoSignUp}>Sign Up</button>
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
};

export default connect(
  (state) => ({
    error: state.auth.error,
  })
)(Login);
