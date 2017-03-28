import React from 'react';
import { connect } from 'react-redux';
import * as AuthActions from '../redux/actions/auth';

const Reset = React.createClass({
  propTypes: {
    params: React.PropTypes.object,
    error: React.PropTypes.string,
  },

  getInitialState() {
    return {
      newPass: '',
      confirmPass: '',
      passwordError: ''
    };
  },

  handleChange(e) {
    const newState = { [e.target.dataset.key]: e.target.value };
    this.setState(newState);
  },

  submitForm(e) {
    e.preventDefault();
    if (this.state.newPass !== this.state.confirmPass) {
      if (/still/.test(this.state.passwordError)) {
        this.setState({ passwordError: 'Passwords do not match.' });
      } else {
        this.setState({ passwordError: 'Passwords still do not match.' });
      }
      return;
    }
    this.setState({ passwordError: '' });
    AuthActions.resetPassword(this.state.newPass, this.props.params.token);
  },

  render() {
    return (
      <div className="login-form">
        <form onSubmit={this.submitForm}>
          <input type="password" placeholder="new password"
            data-key="newPass" value={this.state.newPass} onChange={this.handleChange} autoFocus />
          <input type="password" placeholder="confirm password"
            data-key="confirmPass" value={this.state.confirmPass} onChange={this.handleChange} />
          <span className="error-box" style={{ display: this.state.passwordError ? 'block' : 'none' }}>{ this.state.passwordError }</span>
          <button type="submit">Set Password</button>
        </form>
        <div className={this.props.error ? 'error-box' : 'hidden'}>
          { this.props.error }
        </div>
      </div>
    );
  }
});

export default connect(
  state => ({
    error: state.auth.error,
  })
)(Reset);

