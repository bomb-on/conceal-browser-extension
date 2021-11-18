import React, { useEffect } from 'react';
import { withRouter } from 'react-router';

import AuthHelper from '../helpers/AuthHelper';
import ApiHelper from '../helpers/ApiHelper';
import useAppState from './useAppState';
import { showNotification } from '../helpers/utils';


export const AppContext = React.createContext();
const Auth = new AuthHelper();

const AppContextProvider = props => {
  const [state, dispatch, updatedState] = useAppState(Auth);
  const Api = new ApiHelper({ Auth, state });

  const loginUser = options => {
    const { e, email, password, twoFACode, id } = options;
    e.preventDefault();
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Auth.login(email, password, twoFACode)
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: 'REDIRECT_TO_REFERRER', value: true });
          initApp();
        } else {
          dispatch({ type: 'DISPLAY_MESSAGE', message: res.message, id });
        }
      })
      .catch(err => dispatch({ type: 'DISPLAY_MESSAGE', message: `ERROR ${err}`, id }))
      .finally(() => dispatch({ type: 'FORM_SUBMITTED', value: false }));
  };

  const signUpUser = options => {
    const { e, userName, email, password, id } = options;
    e.preventDefault();
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.signUpUser(userName, email, password)
      .then(res => {
        message = res.message;
        if (res.result === 'success') {
          message = 'Please check your email and follow the instructions to activate your account.';
          return props.history.replace('/login');
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'DISPLAY_MESSAGE', message, id });
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      });
  };

  const resetPassword = options => {
    const { e, email, id } = options;
    e.preventDefault();
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    let message;
    Api.resetPassword(email)
      .then(res => {
        message = res.message;
        if (res.result === 'success') {
          message = 'Please check your email and follow instructions to reset password.';
          Auth.logout();
          clearApp();
          props.history.replace('/');
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'DISPLAY_MESSAGE', message, id });
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      });
  };

  const resetPasswordConfirm = options => {
    const { e, password, token, id } = options;
    e.preventDefault();
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.resetPasswordConfirm(password, token)
      .then(res => {
        message = res.message;
        if (res.result === 'success') {
          message = (<>Password successfully changed.<br />Please log in.</>);
          return props.history.replace('/login');
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'DISPLAY_MESSAGE', message, id });
        dispatch({ type: 'FORM_SUBMITTED', value: false });
      });
  };

  const logoutUser = () => {
    clearApp();
    Auth.logout();
    return props.history.replace('/');
  };

  const getUser = () => {
    Api.getUser()
      .then(res => dispatch({ type: 'USER_LOADED', user: res.message }))
      .catch(e => console.error(e));
  };

  const getQRCode = () => {
    let message;
    Api.getQRCode()
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: 'UPDATE_QR_CODE', qrCodeUrl: res.message.qrCodeUrl });
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message }));
  };

  const check2FA = () => {
    let message;
    Api.check2FA()
      .then(res => {
        if (res.result === 'success') {
          dispatch({ type: '2FA_CHECK', value: res.message.enabled });
          if (!res.message.enabled) getQRCode();
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message }));
  };

  const update2FA = (options, extras) => {
    const { e, twoFACode, enable, id } = options;
    e.preventDefault();
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.update2FA(twoFACode, enable)
      .then(res => {
        if (res.result === 'success') {
          message = `QR Code ${enable ? 'enabled' : 'disabled'}.`;
          check2FA();
          extras.forEach(fn => fn());
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message, id }));
  };

  const hideBalance = balanceHidden => {
    dispatch({ type: 'HIDE_BALANCE', balanceHidden });
  }

  const getWallets = () => {
    let message;
    Api.getWallets()
      .then(res => {
        if (res.result === 'success') {
          const wallets = res.message.wallets;
          dispatch({ type: 'UPDATE_WALLETS', wallets });
        } else {
          message = res.message;
          if (Object.keys(updatedState.current.wallets).length > 0) {
            dispatch({ type: 'CLEAR_WALLETS' });
          }
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        if (message) dispatch({ type: 'DISPLAY_MESSAGE', message });
        dispatch({ type: 'WALLETS_LOADED' });
        dispatch({ type: 'APP_UPDATED' });
      });
  };

  const switchWallet = currentWallet => {
    dispatch({ type: 'UPDATE_CURRENT_WALLET', currentWallet });
    localStorage.setItem('ccx:current_wallet', currentWallet);
  };

  const createWallet = () => {
    let message;
    Api.createWallet()
      .then(res => {
        if (res.result === 'success') {
          const address = res.message.wallet;
          dispatch({ type: 'CREATE_WALLET', address });
          getWallets();
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => message && dispatch({ type: 'DISPLAY_MESSAGE', message }));
  };

  const getWalletKeys = options => {
    const { e, address, code } = options;
    e.preventDefault();
    const { wallets } = state;
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    if (!wallets[address].keys) {
      Api.getWalletKeys(address, code)
        .then(res => {
          if (res.result === 'success') {
            dispatch({ type: 'SET_WALLET_KEYS', keys: res.message, address });
          } else {
            message = res.message;
          }
        })
        .catch(err => { message = err })
        .finally(() => {
          dispatch({ type: 'FORM_SUBMITTED', value: false });
          if (message) showNotification({ message: Array.isArray(message) ? message[0] : message });
        });
    }
  };

  const downloadWalletKeys = keys => {
    const element = document.createElement('a');
    const file = new Blob(
      [JSON.stringify(keys, null, 2)],
      { type: 'text/plain' },
    );
    element.href = URL.createObjectURL(file);
    element.download = 'conceal.json';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const deleteWallet = address => {
    Api.deleteWallet(address)
      .then(res => res.result === 'success' && dispatch({ type: 'DELETE_WALLET', address }))
      .catch(e => console.error(e))
      .finally(() => getWallets());
  };

  const importWallet = (options, extras) => {
    const { e, privateSpendKey, id } = options;
    e.preventDefault();
    let message;
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    Api.importWallet(privateSpendKey)
      .then(res => {
        if (res.result === 'success') {
          const address = res.message.wallet;
          if (!(address in updatedState.current.wallets)) {
            dispatch({type: 'CREATE_WALLET', address});
            getWallets();
            extras.forEach(fn => fn());
          }
        } else {
          message = res.message;
        }
      })
      .catch(err => { message = `ERROR ${err}` })
      .finally(() => {
        dispatch({ type: 'FORM_SUBMITTED', value: false });
        if (message) dispatch({ type: 'DISPLAY_MESSAGE', message, id });
      });
  };

  const sendTx = (options, extras) => {
    const { e, address, label, paymentID } = options;
    e.preventDefault();
    dispatch({ type: 'FORM_SUBMITTED', value: true });
    let sendTxResponse;
    Api.sendTx(options)
      .then(res => {
        if (res.result === 'error' || res.message.error) {
          showNotification({
            message: res.message.error ? res.message.error.message : res.message[0],
            title: 'ERROR SENDING CCX',
            type: 'danger',
            dismiss: { duration: 0, click: false, touch: false, showIcon: true },
          });
          return;
        }
        sendTxResponse = { redirect: res.message.redirect };
        dispatch({ type: 'SEND_TX', sendTxResponse });
        extras.forEach(fn => fn());
        getWallets();
      })
      .catch(err => showNotification({
        message: err,
        title: 'ERROR SENDING CCX',
        type: 'danger',
        dismiss: { duration: 0, click: false, touch: false, showIcon: true },
      }))
      .finally(() => dispatch({ type: 'FORM_SUBMITTED', value: false }));
  };

  const getBlockchainHeight = () => {
    Api.getBlockchainHeight()
      .then(res => dispatch({ type: 'UPDATE_BLOCKCHAIN_HEIGHT', blockchainHeight: res.message.height }))
      .catch(e => console.error(e));
  };

  const getPrices = () => {
    const { appSettings } = state;
    Api.getPrices(appSettings.coingeckoAPI)
      .then(res => dispatch({ type: 'UPDATE_PRICES', pricesData: res }))
      .catch(e => console.error(e));
  };

  const actions = {
    loginUser,
    signUpUser,
    resetPassword,
    resetPasswordConfirm,
    logoutUser,
    getUser,
    getQRCode,
    check2FA,
    update2FA,
    hideBalance,
    getWallets,
    switchWallet,
    createWallet,
    deleteWallet,
    importWallet,
    getWalletKeys,
    downloadWalletKeys,
    sendTx,
    getBlockchainHeight,
    getPrices,
  };

  const initApp = () => {
    const currentWallet = localStorage.getItem('ccx:current_wallet');
    if (currentWallet) dispatch({ type: 'UPDATE_CURRENT_WALLET', currentWallet });
    const { appSettings, userSettings } = state;

    getUser();
    check2FA();
    getWallets();
    getPrices();

    const intervals = [];
    intervals.push(
      { fn: getWallets, time: userSettings.updateWalletsInterval },
      { fn: getPrices, time: appSettings.updateMarketPricesInterval },
    );

    dispatch({ type: 'SET_INTERVALS', intervals });
  };

  const clearApp = () => {
    dispatch({ type: 'CLEAR_APP' });
    dispatch({ type: 'REDIRECT_TO_REFERRER', value: false });
  };

  const onRouteChanged = props => {
    const { location } = props;
    const isRedirect = props.history.action === 'REPLACE';
    if ((location.pathname !== '/signup' && !location.pathname.startsWith('/reset_password')) || !isRedirect) {
      dispatch({ type: 'DISPLAY_MESSAGE', message: null });
    }
    if (location.pathname === '/login' && location.search === '?activated') {
      const message = (<>Account successfully activated.<br />Please log in.</>);
      dispatch({ type: 'DISPLAY_MESSAGE', message });
    }
  };

  useEffect(() => {
    if (state.user.loggedIn()) initApp();
    return () => clearApp();
  }, []);

  useEffect(() => onRouteChanged(props), [props.location]);

  return (
    <AppContext.Provider value={{ state, actions }}>
      {props.children}
    </AppContext.Provider>
  )
};

export default withRouter(AppContextProvider);
