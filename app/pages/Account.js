import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/auth';
import setTitle from '../utils/setTitle';

const Account = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    deleteAccount: React.PropTypes.func,
    updateEmail: React.PropTypes.func,
    updatePassword: React.PropTypes.func,
  },

  getInitialState() {
    return {
      newEmail: '',
      oldPass: '',
      newPass: '',
      confirmNewPass: '',
      passwordError: ''
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.username) {
      setTitle('Account');
    }
  },

  updateForm(e) {
    // console.log(e.target.dataset.key, e.target.value);
    const newState = { [e.target.dataset.key]: e.target.value };
    this.setState(newState);
  },

  updateEmail(e) {
    e.preventDefault();
    if (!this.state.newEmail.length) {
      return;
    }
    this.props.updateEmail(this.props.user._id, this.state.newEmail);
  },

  updatePassword(e) {
    e.preventDefault();
    if (this.state.newPass !== this.state.confirmNewPass) {
      if (/still/.test(this.state.passwordError)) {
        this.setState({ passwordError: 'Passwords do not match.' });
      } else {
        this.setState({ passwordError: 'Passwords still do not match.' });
      }
      return;
    }
    this.setState({ passwordError: '' });
    this.props.updatePassword(this.props.user._id, this.state.oldPass, this.state.newPass);
  },

  deleteAccount(e) {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      this.props.deleteAccount(this.props.user._id);
    }
  },

  render() {
    const email = this.props.user ? this.props.user.email : '';
    return (
      <div className="accountPage">
        <div className="formGroup">
          <form onSubmit={this.sumbmitForm}>
            <label htmlFor="change-email">Change Email</label>
            <small>currently: <em>{ email }</em></small>
            <input type="email" data-key="newEmail" placeholder="new email"
              value={this.state.newEmail} onChange={this.updateForm} required />
            <button type="submit" onClick={this.updateEmail}>Update Email</button>
          </form>
        </div>

        <div className="formGroup">
          <label htmlFor="change-password">Change Password</label>
          <input type="password" data-key="oldPass" placeholder="current password"
            value={this.state.oldPass} onChange={this.updateForm} />
          <input type="password" data-key="newPass" placeholder="new password"
            value={this.state.newPass} onChange={this.updateForm} />
          <input type="password" data-key="confirmNewPass" placeholder="confirm new password"
            value={this.state.confirmNewPass} onChange={this.updateForm} />
          <span className="error-box" style={{ display: this.state.passwordError ? 'block' : 'none' }}>{ this.state.passwordError }</span>
          <button onClick={this.updatePassword}>Update Password</button>
        </div>

        <div className="formGroup">
          <label htmlFor="deleteAccount">Delete Account</label>
          <small><em>This action cannot be undone!</em></small>
          <button className="errorButton" onClick={this.deleteAccount}>
            Delete my account and all its data.
          </button>
        </div>
      </div>
    );
  }
});

export default connect(
  (state, props) => ({
    user: state.auth.user,
  }),
  dispatch => ({
    updateEmail: (userId, newEmail) => dispatch(Actions.updateUserEmail(userId, newEmail)),
    updatePassword: (userId, oldPass, newPass) => dispatch(
      Actions.changePassword(userId, oldPass, newPass)),
    deleteAccount: userId => dispatch(Actions.deleteAccount(userId)),
  })
)(Account);
