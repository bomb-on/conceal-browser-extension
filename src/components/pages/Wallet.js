import React, { useContext, useState } from 'react';
import { IoIosWallet } from 'react-icons/io'
import { FiArrowDownLeft, FiArrowUpRight } from 'react-icons/fi';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

import { AppContext } from '../ContextProvider';
import { FormattedAmount, formattedStringAmount, maskAddress } from '../../helpers/utils';
import Receive from '../elements/Receive';
import Send from '../elements/Send';
import History from '../elements/History';


const Wallet = () => {
  const { actions, state } = useContext(AppContext);
  const { hideBalance, switchWallet } = actions;
  const { layout, prices, userSettings, wallets } = state;
  const { currentWallet } = userSettings;
  const { balanceHidden } = layout;

  const [walletsOpened, setWalletsOpened] = useState(false);
  const [sendOpened, setSendOpened] = useState(false);
  const [receiveOpened, setReceiveOpened] = useState(false);

  const totalCCX = wallets[currentWallet].balance;
  const lockedCCX = wallets[currentWallet].locked;

  const setOpened = el => {
    switch (el) {
      case 'receive':
        setReceiveOpened(!receiveOpened);
        setSendOpened(false);
        break;
      case 'send':
        setSendOpened(!sendOpened);
        setReceiveOpened(false);
        break;
      case 'wallets':
        setWalletsOpened(!walletsOpened);
        break;
      default:
        //
    }
  }

  return (
    <div className="wallet" onClick={() => { walletsOpened && setWalletsOpened(false)}}>
      <div className="wallet-header">
        <div className="wallet-current">
          Current wallet
          <div className="wallet-address">
            {maskAddress(currentWallet)}
            <button
              onClick={() => setOpened('wallets')}
            >
              <IoIosWallet />
            </button>
          </div>
        </div>

        {/*<button
          onClick={() => logoutUser()}
        >
          <IoIosLogOut />
        </button>*/}

        <div className={`wallets-list ${!walletsOpened ? 'hidden' : ''}`}>
          <ul>
            {Object.keys(wallets).map(wallet =>
              <li
                key={wallet}
                onClick={() => {
                  switchWallet(wallet);
                  setWalletsOpened(false);
                }}
              >
                  <span className="wallet-address">{maskAddress(wallet)}</span>
                  <span>({formattedStringAmount({ amount: wallets[wallet].balance, showCurrency: true })})</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="wallet-details">
        <button
          onClick={() => setOpened('send')}
        >
          <FiArrowUpRight />
        </button>
        <div>
          <div className="amount-total">
            {balanceHidden ? '******' : <FormattedAmount amount={totalCCX} showCurrency={false}/>} <small>CCX</small>
            <button onClick={() => hideBalance(!balanceHidden)}>
              {balanceHidden ? <AiFillEye /> : <AiFillEyeInvisible />}
            </button>
          </div>
          {lockedCCX > 0 &&
            <div className="amount-locked">
              Locked: {balanceHidden ? '******' : <FormattedAmount amount={lockedCCX} showCurrency={false}/>} <small>CCX</small>
            </div>
          }
          <div className="amount-usd">
            {balanceHidden ? '$ ******' : <FormattedAmount amount={(totalCCX + lockedCCX) * prices.priceCCXUSD} currency="USD" useSymbol/>}
          </div>
        </div>

        <button
          onClick={() => setOpened('receive')}
        >
          <FiArrowDownLeft />
        </button>
      </div>

      {sendOpened && <Send wallet={currentWallet} />}
      {receiveOpened && <Receive currentWallet={currentWallet} />}
      {!sendOpened && !receiveOpened && <History currentWallet={currentWallet} wallets={wallets} />}
    </div>
  )
};

export default Wallet;
