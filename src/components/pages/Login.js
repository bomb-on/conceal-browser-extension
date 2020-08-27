import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { AppContext } from '../ContextProvider';
import { useFormInput, useFormValidation } from '../../helpers/hooks';
import { ReactComponent as Logo } from '../../static/img/logo.svg';


const Login = props => {
  const { actions, state } = useContext(AppContext);
  const { loginUser } = actions;
  const { layout, user, userSettings } = state;
  const { redirectToReferrer, formSubmitted, message } = layout;

  const { value: email, bind: bindEmail } = useFormInput('');
  const { value: password, bind: bindPassword } = useFormInput('');
  const { value: twoFACode, bind: bindTwoFACode } = useFormInput('');

  const formValidation = (
    email !== '' && email.length >= 3 &&
    password !== '' && password.length >= userSettings.minimumPasswordLength &&
    (twoFACode !== '' ? (twoFACode.length === 6 && parseInt(twoFACode)) : true)
  );
  const formValid = useFormValidation(formValidation);

  if (redirectToReferrer && props.location.state && user.loggedIn()) {
    const { from } = props.location.state;
    return <Redirect to={from} />;
  }

  if (user.loggedIn()) return <Redirect to="/home" />;

  return (
    <div className="login">
      <div className="logo">
        <Logo />
      </div>

      {message.loginForm &&
        <div className="login-error">
          {message.loginForm}
        </div>
      }

      <div>
        <form onSubmit={e => loginUser({ e, email, password, twoFACode, id: 'loginForm' })}>
          <div>
            <input
              {...bindEmail}
              placeholder="Enter your email"
              type="email"
              name="email"
              minLength={3}
            />
          </div>

          <div>
            <input
              {...bindPassword}
              placeholder="Enter your password"
              type="password"
              name="password"
              minLength={8}
            />
          </div>

          <div>
            <input
              {...bindTwoFACode}
              placeholder="2-Factor Authentication (if enabled)"
              type="number"
              name="twoFA"
              max={999999}
            />
          </div>

          <button
            type="submit"
            disabled={formSubmitted || !formValid}
            className="btn btn-primary btn-block btn-signin"
          >
            {formSubmitted ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <small>
          Copyright 2019 &copy; All Rights Reserved. Conceal Network<br /><Link to="/terms">Terms &amp; Conditions</Link>
        </small>
      </div>
    </div>
  )
};

export default Login;
