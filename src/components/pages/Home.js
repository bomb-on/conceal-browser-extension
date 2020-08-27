import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { AppContext } from '../ContextProvider';
import { maskAddress } from '../../helpers/utils';


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
    <div>
      {layout.userLoaded && layout.walletsLoaded
        ? <>
            {Object.keys(wallets).length === 0 &&
              <div>
                NO WALLETS.
              </div>
            }

            {Object.keys(wallets).length > 1 && !userSettings.currentWallet &&
              <>
                <div>Please select a wallet.</div>
                <ul>
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
        : <>Loading...</>
      }


    </div>
  );
};

export default Home;
