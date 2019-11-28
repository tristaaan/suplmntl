import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Header() {
  const { token, user } = useSelector((state) => state.auth);

  return (
    <header>
      <ul className="headerLink-container">
        <li><h1><Link to="/">SUPLMNTL</Link></h1></li>
        { token
          ? (
            <li>
              <Link
                className="headerLink"
                to={`/${user.username}/collections`}>
                Collections
              </Link>
            </li>
          )
          : null }
        <li className="spacer" />
        { token
          ? (
            <li>
              <Link
                className="headerLink"
                to="/account">
                Account
              </Link>
            </li>
          )
          : (
            <li>
              <Link
                className="headerLink"
                to="/login">
                Login
              </Link>
            </li>
          ) }
        { token
          ? (
            <li>
              <Link
                className="headerLink"
                to="/logout">
                Logout
              </Link>
            </li>
          )
          : (
            <li>
              <Link className="headerLink" to="/sign-up">
                Sign Up
              </Link>
            </li>
          ) }
      </ul>
    </header>
  );
}

export default Header;
