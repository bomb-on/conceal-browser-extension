import React from 'react';
import { MemoryRouter as Router, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
// import ReactNotification from 'react-notifications-component'
// import 'react-notifications-component/dist/theme.css';
// import 'animate.css/animate.min.css';

import AppContextProvider from './ContextProvider';
import PrivateRoute from './PrivateRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import Wallet from './pages/Wallet';

import '../static/css/layout.css';
import '../static/css/style.css';
// import '../static/css/font-awesome-animation.min.css';


const history = createMemoryHistory();

const App = () => (
  <Router history={history}>
    <AppContextProvider>
      {/*<ReactNotification />*/}

      <Route exact path="/" component={Login} />

      <PrivateRoute exact path="/home" component={Home} />
      <PrivateRoute exact path="/wallet" component={Wallet} />

    </AppContextProvider>
  </Router>
);

export default App;
