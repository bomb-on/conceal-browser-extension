import React from 'react';
import { Route, Redirect } from 'react-router';

import AuthHelper from '../helpers/AuthHelper';
// import Header from './elements/Header';
// import NavBar from './elements/NavBar';
// import Footer from './elements/Footer';
// import TwoFAWarning from './elements/2FAWarning';


const Auth = new AuthHelper();

const PrivateRoute = props => {
  const { component: Component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={props =>
        Auth.loggedIn()
          ? <>
              {(props.location.pathname.startsWith('/payment/') || props.location.pathname.startsWith('/pay/'))
                ? <Component {...props} />
                : <>
                    {/*<TwoFAWarning />
                    <Header />
                    <NavBar />
                    <Footer />*/}
                    <Component {...props} />
                  </>
              }
            </>
          : <Redirect to={{ pathname: '/' }}/>
      }
    />
  );
};

export default PrivateRoute;
