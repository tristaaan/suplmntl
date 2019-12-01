import React from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import * as AuthActions from '../redux/actions/auth';

function Login() {
  const setCookie = useCookies(['token'])[1];
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const error = useSelector((state) => state.auth.error);

  const sumbmitForm = (e) => {
    e.preventDefault();
    const user = {
      username: e.target[0].value.toLowerCase(),
      password: e.target[1].value
    };
    const rememberMe = e.target[2].value;
    const redirect = location;
    dispatch(AuthActions.login(
      user,
      setCookie,
      rememberMe,
      redirect
    ));
  };

  const gotoSignup = () => {
    history.push('/sign-up');
  };

  return (
    <div className="login-form">
      <form onSubmit={sumbmitForm}>
        <input type="text" placeholder="username" required />
        <input type="password" placeholder="password" required />
        <span>
          <span>
            Remember Me:
            <input type="checkbox" />
          </span>
          <Link to="/forgot">Forgot password?</Link>
        </span>
        <button type="button" onClick={gotoSignup}>Sign Up</button>
        <button type="submit">Login</button>
      </form>
      <div className={error ? 'error-box' : 'hidden'}>
        { error }
      </div>
    </div>
  );
}

export default Login;
