var React = require('react'),
    ajax = require('jquery').ajax;

export default React.createClass({
  getInitialState() {
    return {error: false};
  },
  contextTypes: {
    router: React.PropTypes.object,
  },
  sumbmitForm(e) {
    ajax({
      url: '/login',
      type: 'POST',
      data: {
        username: e.target[0].value,
        password: e.target[1].value
      },
      success: function(data) {
        this.replaceWith('/collections'); //this will change with react-router 1.0.0!
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(err.toString());
      }.bind(this)
    });
    e.preventDefault();
  },
  gotoSignUp() {
    this.context.router.push(`/sign-up`);
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