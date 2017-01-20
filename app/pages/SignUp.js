import React from 'react';
import * as service from '../service';

export default React.createClass({

  contextTypes: {
    router: React.PropTypes.object,
  },

  getInitialState() {
    return { error: false, badPass: false, errorMessage: false };
  },

  sumbmitForm(e) {
    e.preventDefault();
    const user = {
      username: e.target[0].value,
      email: e.target[1].value,
      password: e.target[2].value
    };
    service.signup(user)
      .then((resp) => {
        this.context.router.replace(`/${resp.username}/collections`);
      })
      .catch((error) => {
        console.error(error.message);
      });
  },
  checkPasswords() {
    var pass = this.password.value,
      conf = this.confirmPassword.value,
      message = '',
      bad = false;

    if (pass !== conf) {
      bad = true;
      message = 'Passwords do not match';
    } else if (pass.length < 6) {
      bad = true;
      message = 'Password is too short';
    }

    this.setState({ badPass: bad, errorMessage: message });
  },
  render() {
    return (
      <div className="login-form">
        <form ref={(c) => {this.form = c;}} onSubmit={this.sumbmitForm}>
          <input type="text" name="username" placeholder="username" required />
          <input type="email" name="email" placeholder="email" required />
          <input ref={(c) => {this.password = c;}} type="password" name="password"
            placeholder="password" required onChange={this.checkPasswords} />
          <input ref={(c) => {this.confirmPassword = c;}} type="password" name="confirmPass"
            placeholder="confirm password" required onChange={this.checkPasswords} />
          <button type="submit">Sign Up</button>
        </form>
        <div className={[(this.state.badPass ? 'error-box' : 'hidden'), 'error-box'].join(' ')}>
          {this.state.errorMessage}
        </div>
        <div className={this.state.error ? 'error-box' : 'hidden'}>
          There was an error.
        </div>
      </div>
    );
  }
});
