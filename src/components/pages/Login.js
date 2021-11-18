import React, { useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { AppContext } from '../ContextProvider';
import { useFormInput, useFormValidation } from '../../helpers/hooks';
import logo from '../../static/img/icon_x128.png';


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
				<img src={logo} alt="Logo" />
      </div>

			<div className="welcome">
				<h3>Conceal Wallet</h3>
				<span>Powered by Conceal Cloud</span>
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
              placeholder="Email"
              type="email"
              name="email"
              minLength={3}
            />
          </div>

          <div>
            <input
              {...bindPassword}
              placeholder="Password"
              type="password"
              name="password"
              minLength={8}
            />
          </div>

          <div>
            <input
              {...bindTwoFACode}
              placeholder="2FA (if enabled)"
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
            {formSubmitted ? 'Signing In...' : 'Unlock'}
          </button>
        </form>

        <div className="links">
          Visit <a href="https://conceal.cloud/">Conceal Cloud</a> to create a new account or reset the password.
				</div>

      </div>
    </div>
  )
};

export default Login;
