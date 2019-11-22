import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../redux/actions/auth';

class Header extends React.Component {
  logout() {
    const { dispatch } = this.props;
    dispatch(logout);
  }

  render() {
    const { token, user } = this.props;
    return (
      <header>
        <ul className="headerLink-container">
          <li><h1><Link to="/">SUPLMNTL</Link></h1></li>
          { token
            ? <li><Link className="headerLink" to={`/${user.username}/collections`}>Collections</Link></li>
            : null }
          <li className="spacer" />
          { token
            ? <li><Link className="headerLink" to="account">Account</Link></li>
            : <li><Link className="headerLink" to="login">Login</Link></li> }
          { token
            ? <li><a href="/" className="headerLink" onClick={this.logout}>Sign Out</a></li>
            : <li><Link className="headerLink" to="sign-up">Sign Up</Link></li> }
        </ul>
      </header>
    );
  }
}

Header.propTypes = {
  token: PropTypes.string,
  user: PropTypes.object,
  dispatch: PropTypes.func
};

export default connect(
  (state) => ({
    token: state.auth.token,
    user: state.auth.user
  })
)(Header);
