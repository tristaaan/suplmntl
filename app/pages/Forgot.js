import React from 'react';
import { connect } from 'react-redux';
import * as AuthActions from '../redux/actions/auth';

const Forgot = React.createClass({
  propTypes: {
    error: React.PropTypes.string,
  },

  getInitialState() {
    return { email: '' };
  },

  handleChange(e) {
    const newState = { [e.target.dataset.key]: e.target.value };
    this.setState(newState);
  },

  submitForm(e) {
    e.preventDefault();
    const email = e.target[0].value;
    AuthActions.forgotPassword(email);
  },

  render() {
    return (
      <div className="login-form">
        <form onSubmit={this.submitForm}>
          <input type="email" placeholder="Email" data-key="email"
            value={this.state.email} onChange={this.handleChange} autoFocus />
          <br />
          <button type="submit">Reset Password</button>
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
)(Forgot);
