import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { logout } from '../redux/actions/auth';

function Header() {
  const dispatch = useDispatch();
  const cookies = useCookies();
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
              <a
                href="/"
                className="headerLink"
                onClick={() => dispatch(logout(cookies))}>
                Sign Out
              </a>
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
