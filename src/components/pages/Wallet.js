import React, { useContext, useState } from 'react';
import { FiMenu, FiEye, FiEyeOff, FiChevronLeft, FiLock } from 'react-icons/fi';

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
				<FiMenu className="menu" onClick={() => setOpened('wallets')} />
				<span className="address">{maskAddress(currentWallet)}</span>
				<button className="hide" onClick={() => hideBalance(!balanceHidden)}>
              {balanceHidden ? <FiEye /> : <FiEyeOff />}
        </button>
				<div className="status green" alt="status"></div>
      </div>

			<div className={`sidepanel ${!walletsOpened ? 'hidden' : 'active'}`}>

				<div className="sidepanel-header">
					<h1>Conceal Wallet</h1>
					<FiChevronLeft className="close"></FiChevronLeft>
				</div>

				<div className="contents">
					<div className="wallets-list">
						<h4>My Wallets</h4>
						<ul>
							{Object.keys(wallets).map(wallet =>
								<li
									key={wallet}
									onClick={() => {
										switchWallet(wallet);
										setWalletsOpened(false);
									}}
								>
										<span className="address">{maskAddress(wallet)}</span>
										<span className="balance">{formattedStringAmount({ amount: wallets[wallet].balance, showCurrency: true })}</span>
								</li>
							)}
						</ul>
					</div>
				</div>

				<div className="logout">
					<div className="actions">
						<FiLock className="icon"></FiLock>
						<span className="text">Sign Out</span>
					</div>
				</div>

			</div>

      <div className="wallet-details">
        <div>

					<div className="fiat">
            {balanceHidden ? '$ ******' : <FormattedAmount amount={(totalCCX + lockedCCX) * prices.priceCCXUSD} currency="USD" useSymbol/>}
         	</div>

          <div className="amount-total">
            {balanceHidden ? '******' : <FormattedAmount amount={totalCCX} showCurrency={false}/>} CCX
          </div>

          {lockedCCX > 0 &&
            <div className="amount-locked">
              Locked: {balanceHidden ? '******' : <FormattedAmount amount={lockedCCX} showCurrency={false}/>} CCX
            </div>
					}

        </div>
      </div>

			<div className="wallet-buttons">
				<button onClick={() => setOpened('send')}>
          Send
        </button>
        <button onClick={() => setOpened('receive')}>
          Receive
        </button>
			</div>

      {sendOpened && <Send wallet={currentWallet} />}
      {receiveOpened && <Receive currentWallet={currentWallet} />}
      {!sendOpened && !receiveOpened && <History currentWallet={currentWallet} wallets={wallets} />}

    </div>
  )
};

export default Wallet;
