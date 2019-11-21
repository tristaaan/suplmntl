import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../redux/actions/auth';

class App extends React.component {
  logout() {
    this.props.dispatch(logout);
  }

  render() {
    return (
      <header>
        <ul className="headerLink-container">
          <li><h1><Link to="/">SUPLMNTL</Link></h1></li>
          { this.props.token
            ? <li><Link className="headerLink" to={`/${this.props.user.username}/collections`}>Collections</Link></li>
            : null }
          <li className="spacer" />
          { this.props.token
            ? <li><Link className="headerLink" to="account">Account</Link></li>
            : <li><Link className="headerLink" to="login">Login</Link></li> }
          { this.props.token
            ? <li><a href="/" className="headerLink" onClick={this.logout}>Sign Out</a></li>
            : <li><Link className="headerLink" to="sign-up">Sign Up</Link></li> }
        </ul>
      </header>
    );
  }
}

App.propTypes = {
  token: PropTypes.string,
  user: PropTypes.object,
  dispatch: PropTypes.func
};

export default connect(
  (state) => ({
    token: state.auth.token,
    user: state.auth.user
  })
)(App);
