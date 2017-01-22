import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { logout } from '../redux/actions/auth';

const App = React.createClass({
  propTypes: {
    token: React.PropTypes.string,
    user: React.PropTypes.object,
    dispatch: React.PropTypes.func
  },

  logout() {
    this.props.dispatch(logout);
  },

  render() {
    return (
      <header>
        <ul className="headerLink-container">
          <li><h1><Link to="/">SUPLMNTL</Link></h1></li>
          { this.props.token ?
            <li><Link className="headerLink" to={`/${this.props.user.username}/collections`}>Collections</Link></li>
            : null
          }
          <li className="spacer" />
          { this.props.token ?
            <li>Account</li>
            : <li><Link className="headerLink" to="login">Login</Link></li>
          }
          { this.props.token ?
            <li><a href="/" className="headerLink" onClick={this.logout}>Sign Out</a></li>
            : <li><Link className="headerLink" to="sign-up">Sign Up</Link></li>
          }
        </ul>
      </header>
    );
  }
});

export default connect(
  state => ({
    token: state.auth.token,
    user: state.auth.user
  })
)(App);
