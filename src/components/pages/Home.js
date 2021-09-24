import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { AppContext } from '../ContextProvider';
import { maskAddress } from '../../helpers/utils';

import logo from '../../static/img/icon_x128.png';


const Home = () => {
  const { actions, state } = useContext(AppContext);
  const { switchWallet } = actions;
  const { layout, userSettings, wallets } = state;

  if (userSettings.currentWallet && layout.userLoaded && layout.walletsLoaded) return <Redirect to="/wallet" />;

  if (Object.keys(wallets).length === 1) {
    switchWallet(Object.keys(wallets)[0]);
    return <Redirect to="/wallet" />;
  }

  return (
    <div className="select-wallet">
			<div className="logo">
				<img src={logo} alt="Logo" />
      </div>

			<div className="welcome">
				<h3>Conceal Wallet</h3>
				<span>Powered by Conceal Cloud</span>
			</div>

      {layout.userLoaded && layout.walletsLoaded
        ? <>
            {Object.keys(wallets).length === 0 &&
              <div>
                NO WALLETS.
              </div>
            }

            {Object.keys(wallets).length > 1 && !userSettings.currentWallet &&
              <>
                <h1 className="title">Which wallet would you like to use?</h1>
                <ul className="wallet-list">
                  {Object.keys(wallets).map(wallet =>
                    <li key={wallet}>
                      <button
                        onClick={() => switchWallet(wallet)}
                      >
                        {maskAddress(wallet)}
                      </button>
                    </li>
                  )}
                </ul>
              </>
            }
          </>
        : <><h2>Loading...</h2></>
      }


    </div>
  );
};

export default Home;
