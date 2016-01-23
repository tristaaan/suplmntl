var React = require('react'),
  service = require('../service');

export default React.createClass({
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
    service.login(user)
      .then((response) => {
        console.log(response.data);
        this.context.router.replace('/collections');
      })
      .catch((error) => {
        console.error(error.message);
      });
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