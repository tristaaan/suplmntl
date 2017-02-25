import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/auth';

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
    };
  },

  updateForm(e) {
    console.log(e.target.dataset.key, e.target.value);
    const newState = { [e.target.dataset.key]: e.target.value };
    this.setState(newState);
  },

  updateEmail() {
    this.props.updateEmail(this.props.user._id, this.state.newEmail);
  },

  updatePassword() {
    this.props.updatePassword(this.props.user._id, this.state.oldPass, this.state.oldPass);
  },

  deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      this.props.deleteAccount(this.props.user._id);
    }
  },

  render() {
    return (
      <div className="accountPage">
        <div className="formGroup">
          <label htmlFor="change-email">Change Email</label>
          <input type="email" data-key="newEmail" placeholder="new email"
            value={this.state.newEmail} onChange={this.updateForm} />
          <button>Upadte Email</button>
        </div>

        <div className="formGroup">
          <label htmlFor="change-password">Change Password</label>
          <input type="password" data-key="oldPass" placeholder="current password"
            value={this.state.oldPass} onChange={this.updateForm} />
          <input type="password" data-key="newPass" placeholder="new password"
            value={this.state.newPass} onChange={this.updateForm} />
          <input type="password" data-key="confirmNewPass" placeholder="confirm new password"
            value={this.state.confirmNewPass} onChange={this.updateForm} />
          <button>Update Password</button>
        </div>

        <div className="formGroup">
          <label htmlFor="deleteAccount">Delete Account</label>
          <button className="errorButton">Delete my account and all its data.</button>
        </div>
      </div>
    );
  }
});

export default connect(
  (state, props) => ({
    user: state.auth.user,
    collections: state.collections.list
  }),
  dispatch => ({
    deleteAccount: userId => dispatch(Actions.deleteAccount(userId)),
    updateEmail: (userId, newEmail) => dispatch(Actions.updateUserEmail(userId, newEmail)),
    updatePassword: (userId, oldPass, newPass) => dispatch(
      Actions.changePassword(userId, newPass, oldPass)),
  })
)(Account);
