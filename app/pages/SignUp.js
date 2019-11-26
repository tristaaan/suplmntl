import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { signup } from '../redux/actions/auth';

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);

    this.password = React.createRef();
    this.confirmPassword = React.createRef();

    this.state = {
      badPass: false,
      errorMessage: false
    };
  }

  sumbmitForm(e) {
    e.preventDefault();
    if (this.state.badPass) {
      return;
    }
    const user = {
      username: e.target[0].value,
      email: e.target[1].value,
      password: e.target[2].value
    };
    this.props.signup(user, this.props.cookies, this.props.history);
  }

  checkPasswords() {
    const pass = this.password.current.value;
    const conf = this.confirmPassword.current.value;
    let message = '';
    let bad = false;

    if (pass !== conf) {
      bad = true;
      message = 'Passwords do not match';
    } else if (pass.length < 6) {
      bad = true;
      message = 'Password is too short';
    }

    this.setState({ badPass: bad, errorMessage: message });
  }

  render() {
    return (
      <div className="login-form">
        <form onSubmit={(e) => this.sumbmitForm(e)}>
          <input type="text" name="username" placeholder="username" required />
          <input type="email" name="email" placeholder="email" required />
          <input
            ref={this.password}
            type="password"
            name="password"
            placeholder="password"
            required
            onChange={() => this.checkPasswords()} />
          <input
            ref={this.confirmPassword}
            type="password"
            name="confirmPass"
            placeholder="confirm password"
            required
            onChange={() => this.checkPasswords()} />
          <button type="submit" disabled={this.state.badPass}>Sign Up</button>
        </form>
        <div className={[(this.state.badPass ? 'error-box' : 'hidden'), 'error-box'].join(' ')}>
          {this.state.errorMessage}
        </div>
        <div className={this.props.error ? 'error-box' : 'hidden'}>
          { this.props.error }
        </div>
      </div>
    );
  }
}

SignUpForm.propTypes = {
  signup: PropTypes.func,
  error: PropTypes.string,
  cookies: PropTypes.object,
  history: PropTypes.object,
};

export default withCookies(connect(
  (state, ownProps) => ({
    error: state.auth.error,
    cookies: ownProps.cookies
  }),
  (dispatch) => ({
    signup: (user, cookies, loc) => dispatch(signup(user, cookies, loc))
  })
)(SignUpForm));
