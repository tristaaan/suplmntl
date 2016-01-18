var React = require('react'),
    ReactDOM = require('react-dom'),
    ajax = require('jquery').ajax;

export default React.createClass({
    getInitialState() {
      return {error: false, badPass: false, errorMessage: false};
    },
    sumbmitForm(e) {
      ajax({
        url: '/api/user',
        type: 'PUT',
        data: {
          username: e.target[0].value,
          email: e.target[1].value,
          password: e.target[2].value
        },
        success: function(data) {
          this.replaceWith('/collections'); //this will change with react-router 1.0!
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(err.toString());
        }.bind(this)
      });
      e.preventDefault();
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