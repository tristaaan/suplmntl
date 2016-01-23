var React = require('react'),
    ReactDOM = require('react-dom'),
    service = require('../service');

export default React.createClass({
    getInitialState() {
      return {error: false, badPass: false, errorMessage: false};
    },
    contextTypes: {
      router: React.PropTypes.object,
    },
    sumbmitForm(e) {
      e.preventDefault();
      const user = {
        username: e.target[0].value,
        email: e.target[1].value,
        password: e.target[2].value
      };
      service.signup(user)
        .then((response) => {
          this.context.router.replaceWith('/collections');
        })
        .catch((error) => {
          console.error(error.message);
        });
    },
    checkPasswords() {
      var pass = this.refs.password.value,
        conf = this.refs.confirmPassword.value,
        message = '',
        bad = false; 

        if (pass !== conf) {
          bad = true;
          message = 'Passwords do not match';
        }
        else if (pass.length < 6) {
          bad = true;
          message = 'Password is too short';
        }

        this.setState({badPass: bad, errorMessage: message});
    },
    render() {
        return (
          <div className="login-form">
            <form ref="form" onSubmit={this.sumbmitForm}>
              <input type="text" name="username" placeholder="username" required />
              <input type="email" name="email" placeholder="email" required />
              <input ref="password" type="password" name="password" placeholder="password" required onChange={this.checkPasswords}/> 
              <input ref="confirmPassword" type="password" name="confirmPass" placeholder="confirm password" required onChange={this.checkPasswords}/> 
              <button type="submit">Sign Up</button>    
            </form>
            <div className={(this.state.badPass ? 'error-box' : 'hidden') + ' error-box'}>
              {this.state.errorMessage}
            </div>
            <div className={this.state.error ? 'error-box' : 'hidden'}>
              There was an error.
            </div>
          </div>
        );
    }
});