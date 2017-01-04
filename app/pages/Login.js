import React from 'react';
import * as service from '../service';

import { connect } from 'react-redux';
import * as AuthActions from '../redux/actions/auth';

const Login = React.createClass({
  getInitialState() {
    return {error: false};
  },
  contextTypes: {
    router: React.PropTypes.object,
  },
  sumbmitForm(e) {
    e.preventDefault();
    const user = {
      username: e.target[0].value,
      password: e.target[1].value
    };
    this.props.dispatch(AuthActions.login(user));
  },
  gotoSignUp() {
    this.context.router.push('/sign-up');
  },
  render() {
    return (
      <div className="login-form">
        <form ref="form" onSubmit={this.sumbmitForm}>
          <input type="text" placeholder="username" required />
          <input type="password" placeholder="password" required/> 
          <button type="button" onClick={this.gotoSignUp}>Sign Up</button>    
          <button type="submit">Login</button>    
        </form>
        <div className={this.state.error ? 'error-box' : 'hidden'}>
          There was an error.
        </div>
      </div>
    );
  }
});

export default connect(
  state => ({})
)(Login)